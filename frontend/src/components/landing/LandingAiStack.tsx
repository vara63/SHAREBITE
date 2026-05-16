import { Activity, Brain, GitBranch, Leaf, ShieldCheck, ThermometerSun, Truck } from "lucide-react";

export function LandingAiStack() {
  const tiles = [
    {
      title: "Multi-signal freshness graph",
      copy: "Fuses food class, quantity, pickup window, travel time, and humidity heuristics into a 0–100 freshness score with guardrails.",
      icon: <ThermometerSun size={22} />
    },
    {
      title: "Corridor demand radar",
      copy: "Classifies micro-demand as surging, steady, or cooling so donors stage the right SKUs and receivers prioritize scarce lanes.",
      icon: <Activity size={22} />
    },
    {
      title: "Neural routing + cost engine",
      copy: "LLM-augmented JSON plans merge with deterministic fallbacks so you always ship an ETA, INR band, and human-readable route story.",
      icon: <GitBranch size={22} />
    },
    {
      title: "Carbon-aware dispatch",
      copy: "Every plan carries estimated CO₂ avoided from rescued meals plus distance-aware logistics overhead for sustainability reporting.",
      icon: <Leaf size={22} />
    },
    {
      title: "Vehicle & batching classifiers",
      copy: "Recommends refrigerated van, insulated EV, or scout bike paths and states when multi-stop batching is safe vs isolated runs.",
      icon: <Truck size={22} />
    },
    {
      title: "Compliance copilot",
      copy: "Chain-of-custody, allergen logging, and intake QR hints ride along with each AI plan so field teams stay inspection ready.",
      icon: <ShieldCheck size={22} />
    }
  ] as const;

  return (
    <section className="border-y border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-16 text-slate-200 sm:px-6 sm:py-20 lg:px-8 lg:py-24" id="ai-stack">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/40 bg-violet-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-violet-200">
          <Brain className="size-4" /> Extreme AI layer
        </p>
        <h2 className="text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Models that understand food—not generic delivery.</h2>
        <p className="mt-4 text-pretty text-base leading-relaxed text-slate-400 sm:text-lg">
          FoodShare couples OpenRouter-ready LLMs with deterministic safety rails. You get startup polish, operator-grade transparency, and a fallback estimator that never leaves volunteers blind.
        </p>
      </div>
      <div className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-2 sm:gap-3">
        {["Structured JSON contracts", "12s model timeout", "Freshness + demand fusion", "Weather + humidity cues", "Live JWT-scoped APIs"].map((label) => (
          <span
            key={label}
            className="rounded-full border border-violet-400/35 bg-violet-500/15 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-violet-100 sm:px-4 sm:text-xs"
          >
            {label}
          </span>
        ))}
      </div>
      <div className="mx-auto mt-12 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {tiles.map((tile) => (
          <article
            key={tile.title}
            className="min-w-0 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/90 to-slate-950/95 p-5 shadow-2xl shadow-black/40 sm:p-6"
          >
            <div className="mb-4 grid size-12 place-items-center rounded-xl bg-gradient-to-br from-violet-500/40 to-teal-500/25 text-violet-100">
              {tile.icon}
            </div>
            <h4 className="text-lg font-bold text-white">{tile.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{tile.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
