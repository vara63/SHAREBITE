import type { ReactNode } from "react";
import { cn } from "../../cn";
import type { Role } from "../../types/foodshare";

export function Stat({
  icon,
  label,
  value,
  accent,
  role
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  accent: "green" | "blue" | "amber";
  role: Role;
}) {
  const card = cn(
    "relative min-w-0 overflow-hidden rounded-2xl border p-5 shadow-md transition [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:shadow-lg sm:p-6",
    accent === "green" &&
      (role === "donor" ? "border-orange-100 bg-gradient-to-br from-orange-50/90 to-white" : "border-emerald-100 bg-gradient-to-br from-emerald-50/90 to-white"),
    accent === "blue" && "border-blue-100 bg-gradient-to-br from-blue-50/80 to-white",
    accent === "amber" && "border-amber-100 bg-gradient-to-br from-amber-50/90 to-white"
  );
  const iconWrap = cn(
    "mb-4 grid size-12 place-items-center rounded-xl shadow-inner",
    accent === "green" && (role === "donor" ? "bg-orange-100 text-orange-800" : "bg-emerald-100 text-emerald-800"),
    accent === "blue" && "bg-blue-100 text-blue-800",
    accent === "amber" && "bg-amber-100 text-amber-900"
  );
  return (
    <div className={card}>
      <div className={iconWrap}>{icon}</div>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block min-w-0 break-words text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">{value}</strong>
    </div>
  );
}
