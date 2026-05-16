import { Building2, CheckCircle2, MapPin, Navigation } from "lucide-react";
import { cn } from "../../cn";
import type { Claim } from "../../types/foodshare";

const claimTone = {
  pending: "bg-amber-50 text-amber-800",
  approved: "bg-emerald-50 text-emerald-800",
  rejected: "bg-red-50 text-red-800",
  completed: "bg-slate-100 text-slate-700"
} satisfies Record<Claim["status"], string>;

export function ClaimBoard({
  claims,
  selectedClaimId,
  onSelectClaim,
  onVerifyCode
}: {
  claims: Claim[];
  selectedClaimId: string;
  onSelectClaim: (claim: Claim) => void;
  onVerifyCode: (id: string, code: string) => void;
}) {
  if (!claims.length) {
    return (
      <section className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 px-6 py-12 text-center sm:px-10">
        <div className="mx-auto max-w-lg">
          <p className="text-xs font-black uppercase tracking-wider text-blue-600">My claims</p>
          <h3 className="mt-2 text-xl font-extrabold text-slate-900 sm:text-2xl">No claim requests yet</h3>
          <span className="mt-3 block text-sm leading-relaxed text-slate-600">
            Request a listing above and FoodShare will create a pending order with AI route, ETA, cost, and pickup guidance.
          </span>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8 rounded-3xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/40 p-5 shadow-lg shadow-blue-900/5 sm:p-6">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-blue-600">My claims</p>
          <h3 className="text-xl font-extrabold text-slate-900 sm:text-2xl">Food claim requests</h3>
        </div>
        <span className="w-fit rounded-full bg-blue-600 px-3 py-1 text-xs font-black text-white">{claims.length} active</span>
      </div>
      <div className="grid gap-4">
        {claims.map((claim) => {
          const plan = claim.ai_plan;
          return (
            <article
              className={cn(
                "cursor-pointer rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5",
                selectedClaimId === claim.id ? "border-blue-500 ring-2 ring-blue-400/30" : "border-slate-200 hover:border-blue-200"
              )}
              key={claim.id}
              onClick={() => onSelectClaim(claim)}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-black uppercase", claimTone[claim.status])}>
                  <CheckCircle2 className="size-4" /> Claim {claim.status}
                </span>
                <small className="font-mono text-xs text-slate-400">#{claim.id.slice(0, 8).toUpperCase()}</small>
              </div>
              <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <h4 className="min-w-0 break-words text-lg font-bold text-slate-900">{claim.title}</h4>
                  <p className="mt-2 flex min-w-0 items-center gap-2 text-sm text-slate-600">
                    <Building2 className="size-4 shrink-0 text-slate-400" /> <span className="min-w-0 break-words">{claim.donor_name}</span>
                  </p>
                  <p className="flex min-w-0 items-center gap-2 text-sm text-slate-600">
                    <MapPin className="size-4 shrink-0 text-slate-400" /> <span className="min-w-0 break-words">Pickup: {claim.location}</span>
                  </p>
                </div>
                <div className="grid min-w-0 w-full max-w-full gap-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm lg:ml-auto lg:w-auto lg:max-w-[240px] lg:shrink-0 lg:text-right">
                  <strong className="text-lg font-black text-slate-900">{plan.etaMinutes} min</strong>
                  <span className="font-bold text-slate-700">INR {plan.estimatedCostInr}</span>
                  {typeof plan.freshnessScore === "number" && <span className="text-xs font-semibold text-sky-700">{Math.round(plan.freshnessScore)}/100 fresh</span>}
                  <em className="text-xs not-italic text-amber-800">{plan.spoilageRisk} risk</em>
                  <small className="font-mono text-[10px] text-slate-500">{plan.source === "openrouter" ? "OpenRouter" : "Estimator"}</small>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                <span className={cn("rounded-full px-2.5 py-1", claimTone[claim.status])}>{claim.status}</span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-800">AI route ready</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1">
                  {claim.status === "completed" ? "Code verified" : claim.status === "approved" ? "Enter pickup code" : "Waiting for donor"}
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1">Delivery proof</span>
              </div>
              {claim.status === "approved" && (
                <form
                  className="mt-4 flex flex-col gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3 sm:flex-row"
                  onSubmit={(event) => {
                    event.preventDefault();
                    const form = new FormData(event.currentTarget);
                    onVerifyCode(claim.id, String(form.get("code") || ""));
                  }}
                >
                  <input
                    name="code"
                    inputMode="numeric"
                    maxLength={6}
                    minLength={6}
                    pattern="\d{6}"
                    placeholder="Enter 6 digit pickup code"
                    required
                    className="min-h-11 flex-1 rounded-xl border border-emerald-200 bg-white px-3 text-sm font-bold tracking-widest text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                  />
                  <button type="submit" className="min-h-11 rounded-xl bg-emerald-600 px-4 text-sm font-black text-white transition hover:bg-emerald-700">
                    Verify code
                  </button>
                </form>
              )}
              <p className="mt-3 flex min-w-0 items-start gap-2 break-words text-sm font-semibold text-slate-700">
                <Navigation className="mt-0.5 size-4 shrink-0 text-brand-600" /> {plan.bestRoute}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
