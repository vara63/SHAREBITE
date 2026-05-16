import { BarChart3, Layers, Navigation, ThermometerSun } from "lucide-react";

export function Marketing() {
  const capabilities = [
    ["Neural route planner", "ETA, distance, INR cost, and human-readable corridor stories before a claim locks.", Navigation],
    ["Freshness + demand fusion", "Spoilage tier, 0–100 freshness score, and surging/steady/cooling demand for every SKU.", ThermometerSun],
    ["Impact + compliance studio", "CO₂ avoided, monthly meal curves, and auto compliance narration for audits.", BarChart3]
  ] as const;

  return (
    <section className="border-y border-slate-200 bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24" id="product">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-teal-800">
          <Layers className="size-4" /> Platform surface
        </p>
        <h2 className="text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Everything to match, move, and measure surplus food—without duct tape.
        </h2>
      </div>
      <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-3">
        {capabilities.map(([title, copy, Icon]) => (
          <article key={title} className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm transition [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:border-brand-200 [@media(hover:hover)]:hover:bg-white [@media(hover:hover)]:hover:shadow-lg">
            <span className="grid size-12 place-items-center rounded-xl bg-white text-brand-600 shadow-md ring-1 ring-slate-100">
              <Icon className="size-6" />
            </span>
            <h3 className="mt-5 text-lg font-bold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
