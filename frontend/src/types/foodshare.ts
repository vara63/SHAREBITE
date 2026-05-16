export type FeedFilter = "all" | "cooked" | "bakery" | "produce";

export type Role = "donor" | "receiver";

export type User = { id: string; name: string; email: string; role: Role; location: string };

export type Donation = {
  id: string;
  donor_id: string;
  title: string;
  category: string;
  quantity: number;
  location: string;
  donor_phone?: string;
  pickup_window: string;
  expires_at: string;
  status: string;
  donor_name: string;
};

export type AiPlan = {
  etaMinutes: number;
  distanceKm: number;
  estimatedCostInr: number;
  spoilageRisk: string;
  bestRoute: string;
  pickupAdvice: string;
  confidence: number;
  source?: "openrouter" | "local-estimator";
  generatedAt?: string;
  freshnessScore?: number;
  demandSignal?: string;
  carbonKgSaved?: number;
  recommendedVehicle?: string;
  weatherRiskNote?: string;
  batchingSuggestion?: string;
  complianceNotes?: string;
  neuralSummary?: string;
};

export type AnalyticsOverview = {
  meals_shared?: number;
  active_claims?: number;
  co2SavedKg?: number;
  monthlyTrend?: { month: string; meals: number }[];
};

export type Claim = {
  id: string;
  status: "pending" | "approved" | "rejected" | "completed";
  ai_plan: AiPlan;
  created_at: string;
  donation_id: string;
  title: string;
  category: string;
  quantity: number;
  location: string;
  pickup_window: string;
  expires_at: string;
  donation_status: string;
  approval_code?: string;
  donor_name: string;
  receiver_name: string;
  receiver_location: string;
};

export const demoCredentials: Record<Role, { email: string; password: string; label: string }> = {
  donor: { email: "donor@sharebite.dev", password: "password123", label: "Donor login" },
  receiver: { email: "receiver@sharebite.dev", password: "password123", label: "Receiver login" }
};
