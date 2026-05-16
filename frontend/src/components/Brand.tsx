import { HandHeart } from "lucide-react";
import { cn } from "../cn";

export function Brand({ variant = "default" }: { variant?: "default" | "donor" | "receiver" }) {
  const markClass =
    variant === "donor"
      ? "from-orange-400 via-donor-500 to-emerald-800 shadow-orange-600/30"
      : variant === "receiver"
        ? "from-sky-400 via-receiver-500 to-teal-600 shadow-blue-600/30"
        : "from-teal-400 via-brand-500 to-emerald-800 shadow-teal-600/35";
  return (
    <div className="flex min-w-0 items-center gap-3 text-lg font-black tracking-tight text-white sm:text-xl">
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-white shadow-lg ring-1 ring-white/20 sm:size-11 sm:rounded-[13px]",
          markClass
        )}
      >
        <HandHeart className="size-[22px]" />
      </span>
      <span>FoodShare</span>
    </div>
  );
}
