import { CheckCircle2, HandHeart, PackagePlus, Radio } from "lucide-react";

export function LandingPersonas() {
  return (
    <section className="border-y border-slate-200/80 bg-gradient-to-b from-stone-50 via-white to-violet-50/30 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24" id="personas">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-violet-800">
          <Radio className="size-4" /> Donor vs receiver
        </p>
        <h2 className="text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
          One platform—two mission-critical consoles.
        </h2>
        <p className="mt-4 text-pretty text-base leading-relaxed text-slate-600 sm:text-lg">
          Donors protect inventory and brand trust. Receivers protect communities and timing. FoodShare routes intelligence differently for each role while keeping a single source of truth for every claim.
        </p>
      </div>
      <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-2 lg:gap-8">
        <article className="group relative min-w-0 overflow-hidden rounded-2xl border border-orange-100 bg-white p-6 shadow-xl shadow-orange-950/5 ring-1 ring-orange-500/10 transition [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:shadow-2xl sm:p-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-donor-500 to-amber-400" />
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-orange-800">
            <PackagePlus className="size-4" /> Donor control room
          </div>
          <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">Publish, protect, prove.</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            Built for commissaries, cloud kitchens, grocers, and CSR teams who need audit-friendly surplus workflows—not ad hoc chats.
          </p>
          <ul className="mt-6 grid gap-3.5 text-sm text-slate-700 sm:text-[15px]">
            {[
              "Neural readiness scores every listing for spoilage, staffing, and corridor friction before receivers commit.",
              "Demand radar surfaces which neighborhoods are surging so you can stage portions where they will clear fastest.",
              "Carbon + compliance narratives auto-generated for ESG decks, donors, and regulators—grounded in live route math.",
              "Batching engine tells you when to isolate high-risk trays versus when to merge compatible stops safely."
            ].map((line) => (
              <li key={line} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 size-[18px] shrink-0 text-emerald-600" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 border-t border-slate-100 pt-4 font-mono text-xs font-semibold text-slate-500">
            Donor theme · Ember + forest accent · Operations-first IA
          </p>
        </article>

        <article className="group relative min-w-0 overflow-hidden rounded-2xl border border-blue-100 bg-white p-6 shadow-xl shadow-blue-950/5 ring-1 ring-receiver-500/10 transition [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:shadow-2xl sm:p-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-receiver-500 to-teal-400" />
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-800">
            <HandHeart className="size-4" /> Receiver mission desk
          </div>
          <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">Discover, dispatch, deliver.</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            Built for NGOs, shelters, student hubs, and hyperlocal volunteers who need predictable pickups without burning out field teams.
          </p>
          <ul className="mt-6 grid gap-3.5 text-sm text-slate-700 sm:text-[15px]">
            {[
              "Preview AI plans with INR cost, ETA, vehicle class, and weather-risk notes before you accept a handoff.",
              "Freshness graph (0–100) translates model confidence into a single executive-friendly signal for your ops lead.",
              "Claim board becomes a live mission timeline—route string, risk tier, and model source stamped per order.",
              "Pickup capacity chart breaks down claim pressure by geography so you rebalance volunteers before bottlenecks hit."
            ].map((line) => (
              <li key={line} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 size-[18px] shrink-0 text-receiver-500" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 border-t border-slate-100 pt-4 font-mono text-xs font-semibold text-slate-500">
            Receiver theme · Electric blue + aqua accent · Field-first IA
          </p>
        </article>
      </div>
    </section>
  );
}
