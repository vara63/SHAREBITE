import { Sparkles } from "lucide-react";
import { Metric } from "../ui/Metric";

export function LandingProof() {
  const testimonials = [
    ["FoodShare reads like a Series A logistics product—our donors finally trust the ops story.", "Aaranya Foods"],
    ["Freshness scoring plus INR pickup bands let us brief volunteers in one screen.", "Seva Kitchen"],
    ["We split donor and receiver workflows cleanly; compliance notes alone saved hours weekly.", "Community Relief Hub"]
  ] as const;

  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24" id="proof">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-teal-800">
          <Sparkles className="size-4" /> Proof & momentum
        </p>
        <h2 className="text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Trusted by teams who treat food rescue like infrastructure.</h2>
      </div>
      <div className="mx-auto mt-12 grid max-w-6xl gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="grid gap-3 sm:grid-cols-2">
          <Metric value="11,820" label="meals delivered" />
          <Metric value="6.7 t" label="CO₂ avoided" />
          <Metric value="94%" label="handoff success" />
          <Metric value="3.8×" label="faster matching" />
        </div>
        <div className="grid gap-4">
          {testimonials.map(([quote, name]) => (
            <blockquote key={name} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 shadow-sm sm:p-6">
              <p className="text-[15px] font-semibold leading-relaxed text-slate-800 sm:text-base">{quote}</p>
              <cite className="mt-4 block font-black not-italic text-brand-600">{name}</cite>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
