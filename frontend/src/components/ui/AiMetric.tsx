import type { ReactNode } from "react";

export function AiMetric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
      <span className="grid size-9 place-items-center rounded-lg bg-slate-100 text-slate-700">{icon}</span>
      <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-0.5 block min-w-0 break-words text-sm font-bold leading-snug text-slate-900">{value}</strong>
    </div>
  );
}
