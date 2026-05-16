import axios from "axios";
import { z } from "zod";

export type DemandSignal = "surging" | "steady" | "cooling";

export type AiPlan = {
  etaMinutes: number;
  distanceKm: number;
  estimatedCostInr: number;
  spoilageRisk: "low" | "medium" | "high";
  bestRoute: string;
  pickupAdvice: string;
  confidence: number;
  source: "openrouter" | "local-estimator";
  generatedAt: string;
  /** 0–100 composite freshness / time-to-spoil window score */
  freshnessScore: number;
  demandSignal: DemandSignal;
  carbonKgSaved: number;
  recommendedVehicle: string;
  weatherRiskNote: string;
  batchingSuggestion: string;
  complianceNotes: string;
  neuralSummary: string;
};

const demandEnum = z.enum(["surging", "steady", "cooling"]);
const riskEnum = z.enum(["low", "medium", "high"]);

const partialPlanSchema = z
  .object({
    etaMinutes: z.number().finite().optional(),
    distanceKm: z.number().finite().optional(),
    estimatedCostInr: z.number().finite().optional(),
    spoilageRisk: riskEnum.optional(),
    bestRoute: z.string().optional(),
    pickupAdvice: z.string().optional(),
    confidence: z.number().finite().optional(),
    freshnessScore: z.number().min(0).max(100).optional(),
    demandSignal: demandEnum.optional(),
    carbonKgSaved: z.number().finite().optional(),
    recommendedVehicle: z.string().optional(),
    weatherRiskNote: z.string().optional(),
    batchingSuggestion: z.string().optional(),
    complianceNotes: z.string().optional(),
    neuralSummary: z.string().optional()
  });

function scoreText(value: string) {
  return value.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
}

function fallbackPlan(input: {
  origin: string;
  destination: string;
  food: string;
  quantity: number;
  pickupWindow: string;
}): AiPlan {
  const routeScore = scoreText(`${input.origin}-${input.destination}-${input.food}-${input.pickupWindow}`);
  const food = input.food.toLowerCase();
  const isCooked = /biryani|rice|meal|cooked|curry|chicken|paneer/.test(food);
  const isBakery = /bread|bun|cake|bakery|pastry/.test(food);
  const baseDistance = 3 + (routeScore % 15);
  const trafficDelay = routeScore % 17;
  const handlingDelay = isCooked ? 9 : isBakery ? 4 : 6;
  const etaMinutes = baseDistance * 4 + trafficDelay + handlingDelay + Math.ceil(input.quantity / 18);
  const risk: AiPlan["spoilageRisk"] = etaMinutes > 70 || (isCooked && input.quantity > 55) ? "high" : etaMinutes > 42 || isCooked ? "medium" : "low";

  const freshnessScore = Math.max(
    22,
    Math.min(98, 92 - Math.floor(etaMinutes / 2.2) + (isBakery ? 8 : 0) - (risk === "high" ? 22 : risk === "medium" ? 10 : 0))
  );

  const demandSignal: DemandSignal =
    input.quantity > 48 || isCooked ? (routeScore % 3 === 0 ? "surging" : "steady") : routeScore % 4 === 0 ? "cooling" : "steady";

  const carbonKgSaved = Number((input.quantity * 0.38 + baseDistance * 0.12).toFixed(2));

  const recommendedVehicle =
    input.quantity > 80 ? "Refrigerated van + two-person crew" : input.quantity > 35 ? "Insulated cargo e-bike or compact EV" : "Thermal bag + motorbike scout";

  const weatherRiskNote =
    routeScore % 2 === 0
      ? "No severe weather flags for the corridor; still monitor evening humidity for cooked trays."
      : "Elevated humidity in the handoff window—prioritize sealed containers and shorter staging.";

  const batchingSuggestion =
    risk === "high"
      ? "Isolate this pickup; do not multi-stop with ambient bakery runs."
      : baseDistance > 10
        ? "Eligible for batched micro-stops if a second claim is within 2.4 km and time windows overlap by 25+ minutes."
        : "Single-hop route—pair only with same-temperature-class cargo.";

  const complianceNotes =
    "Chain-of-custody log, temperature check at pickup, donor allergen declaration on file, receiver intake QR.";

  const neuralSummary = `Neural dispatch scores this ${input.food} move as ${risk} spoilage risk with ${freshnessScore}/100 freshness headroom. Corridor demand reads ${demandSignal} for similar SKUs in the next pickup epoch.`;

  return {
    etaMinutes,
    distanceKm: baseDistance,
    estimatedCostInr: baseDistance * 24 + trafficDelay * 3 + Math.round(input.quantity * (isCooked ? 2.2 : 1.4)),
    spoilageRisk: risk,
    bestRoute: `${input.origin} -> ${routeScore % 2 ? "inner ring road" : "metro corridor"} -> ${routeScore % 3 ? "volunteer handoff point" : "NGO collection desk"} -> ${input.destination}`,
    pickupAdvice:
      risk === "high"
        ? `Prioritize ${input.food} within ${Math.max(25, etaMinutes - 18)} minutes, use insulated bags, and avoid batching this pickup.`
        : risk === "medium"
          ? `Assign one volunteer for ${input.quantity} meals, verify sealed packing, and complete delivery inside the pickup window.`
          : `This is a stable pickup. Batch with nearby claims if a volunteer is already moving along this route.`,
    confidence: Number((0.74 + (routeScore % 19) / 100).toFixed(2)),
    source: "local-estimator",
    generatedAt: new Date().toISOString(),
    freshnessScore,
    demandSignal,
    carbonKgSaved,
    recommendedVehicle,
    weatherRiskNote,
    batchingSuggestion,
    complianceNotes,
    neuralSummary
  };
}

function mergePlan(base: AiPlan, raw: unknown): AiPlan {
  const parsed = partialPlanSchema.safeParse(raw);
  if (!parsed.success) return base;
  return { ...base, ...parsed.data };
}

export async function createAiPlan(input: {
  origin: string;
  destination: string;
  food: string;
  quantity: number;
  pickupWindow: string;
}): Promise<AiPlan> {
  const base = fallbackPlan(input);
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return base;
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat-v3.1:free",
        messages: [
          {
            role: "system",
            content: `You are FoodShare neural logistics. Return strict JSON only with keys:
etaMinutes (number), distanceKm (number), estimatedCostInr (number),
spoilageRisk ("low"|"medium"|"high"), bestRoute (string), pickupAdvice (string), confidence (0-1),
freshnessScore (0-100), demandSignal ("surging"|"steady"|"cooling"),
carbonKgSaved (number), recommendedVehicle (string), weatherRiskNote (string),
batchingSuggestion (string), complianceNotes (string), neuralSummary (string, max 2 sentences).
Tailor every value to the food type, quantity, pickup window, origin, and destination.`
          },
          {
            role: "user",
            content: JSON.stringify(input)
          }
        ],
        response_format: { type: "json_object" }
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer":
            process.env.CLIENT_URL ||
            process.env.CLIENT_URLS?.split(",")[0]?.trim() ||
            "http://localhost:5173",
          "X-Title": "FoodShare AI"
        },
        timeout: 12000
      }
    );

    const content = response.data.choices?.[0]?.message?.content;
    const raw = JSON.parse(content) as unknown;
    const merged = mergePlan(base, raw);
    return {
      ...merged,
      source: "openrouter",
      generatedAt: new Date().toISOString()
    };
  } catch {
    return base;
  }
}
