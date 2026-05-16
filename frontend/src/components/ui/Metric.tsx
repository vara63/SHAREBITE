import { cn } from "../../cn";

export function Metric({ value, label, dark }: { value: string; label: string; dark?: boolean }) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-2xl border p-4 shadow-sm sm:p-5",
        dark ? "border-white/10 bg-slate-900/60 backdrop-blur-md" : "border-slate-200 bg-white ring-1 ring-slate-900/[0.03]"
      )}
    >
      <strong className={cn("block min-w-0 break-words text-2xl font-black tracking-tight sm:text-3xl", dark ? "text-white" : "text-slate-900")}>{value}</strong>
      <span className={cn("mt-1 block text-xs font-bold uppercase tracking-wide sm:text-sm", dark ? "text-slate-400" : "text-slate-500")}>{label}</span>
    </div>
  );
}
