import { ArrowRight, Cpu, LineChart, Zap } from "lucide-react";
import { Brand } from "../components/Brand";
import { ProductVisual } from "../components/ProductVisual";
import { Metric } from "../components/ui/Metric";
import { cn } from "../cn";

export type PublicPage = "home" | "personas" | "ai-stack" | "platform" | "proof";

export type LandingPageProps = {
  page: PublicPage;
  onGoToAuth: (mode: "login" | "register") => void;
  onNavigate: (path: string) => void;
};

const navItems: { label: string; path: string; page: PublicPage }[] = [
  { label: "Home", path: "/", page: "home" },
  { label: "Donors & receivers", path: "/personas", page: "personas" },
  { label: "Neural stack", path: "/ai-stack", page: "ai-stack" },
  { label: "Platform", path: "/platform", page: "platform" },
  { label: "Proof", path: "/proof", page: "proof" }
];

export function LandingPage({ page, onGoToAuth, onNavigate }: LandingPageProps) {
  return (
    <main className="min-h-dvh overflow-x-clip bg-slate-950 text-slate-200">
      <nav className="sticky top-0 z-50 flex min-w-0 max-w-full flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-slate-950/80 px-4 py-3 backdrop-blur-xl sm:gap-4 sm:px-6 lg:px-8">
        <button type="button" className="min-w-0 shrink text-left" onClick={() => onNavigate("/")}>
          <Brand />
        </button>
        <div className="order-3 flex w-full min-w-0 max-w-full flex-nowrap items-center gap-2 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:order-none sm:ml-auto sm:w-auto sm:max-w-none sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden lg:gap-3">
          {navItems.map((item) => (
            <button
              key={item.path}
              type="button"
              className={cn(
                "shrink-0 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-bold transition",
                page === item.page ? "bg-white/10 text-white ring-1 ring-white/10" : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
              onClick={() => onNavigate(item.path)}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            className="shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold text-white/90 transition hover:bg-white/10"
            onClick={() => onGoToAuth("login")}
          >
            Log in
          </button>
          <button
            type="button"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-teal-600/30 transition hover:brightness-110"
            onClick={() => onGoToAuth("register")}
          >
            Start free <ArrowRight className="size-4" />
          </button>
        </div>
      </nav>

      <section className="relative border-b border-white/5 bg-[radial-gradient(ellipse_80%_50%_at_20%_-10%,rgba(139,92,246,0.35),transparent),radial-gradient(ellipse_60%_45%_at_85%_10%,rgba(59,130,246,0.22),transparent),linear-gradient(180deg,#020617_0%,#0f172a_55%,#020617_100%)]">
        <div className="mx-auto grid min-w-0 max-w-[1440px] items-center gap-10 px-4 pb-16 pt-10 sm:gap-12 sm:px-6 sm:pb-20 sm:pt-14 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="min-w-0 max-w-xl lg:max-w-none">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/40 bg-violet-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-violet-200">
              <Cpu className="size-4" /> Neural logistics for surplus food
            </p>
            <h1 className="text-balance text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
              Coordinate rescue-grade food ops with an AI control plane.
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-slate-400 sm:text-lg">
              FoodShare gives donors and receivers separate workspaces for inventory, claims, dispatch, route intelligence, and impact reporting.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                type="button"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 px-6 py-3.5 text-base font-bold text-white shadow-xl shadow-teal-600/25 transition hover:brightness-110"
                onClick={() => onGoToAuth("login")}
              >
                Open live console <ArrowRight className="size-5" />
              </button>
              <button
                type="button"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-6 py-3.5 text-base font-bold text-white backdrop-blur-sm transition hover:bg-white/10"
                onClick={() => onNavigate("/platform")}
              >
                Explore platform
              </button>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              <span className="rounded-full border border-violet-400/45 bg-violet-500/15 px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wide text-violet-100">
                OpenRouter-ready models
              </span>
              {["Freshness graph 0-100", "Demand surge radar", "Batching & vehicle class", "Chain-of-custody hints"].map((t) => (
                <span key={t} className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <Metric value="18.4k" label="meals routed" dark />
              <Metric value="31 min" label="avg pickup ETA" dark />
              <Metric value="42%" label="waste reduced" dark />
            </div>
          </div>

          <div className="relative min-h-0 min-w-0">
            <ProductVisual />
            <div className="mt-4 flex flex-col gap-3 sm:absolute sm:inset-x-0 sm:bottom-4 sm:mt-0 sm:flex-row sm:justify-between sm:gap-4 sm:px-2">
              <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-slate-900/90 p-3.5 shadow-xl backdrop-blur-md sm:max-w-[240px]">
                <Zap className="mt-0.5 size-[18px] shrink-0 text-teal-400" />
                <div>
                  <strong className="block text-sm font-bold text-white">Neural ETA</strong>
                  <span className="text-xs font-medium text-slate-400">Traffic + thermal latency model</span>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-slate-900/90 p-3.5 shadow-xl backdrop-blur-md sm:max-w-[240px]">
                <LineChart className="mt-0.5 size-[18px] shrink-0 text-sky-400" />
                <div>
                  <strong className="block text-sm font-bold text-white">Demand signal</strong>
                  <span className="text-xs font-medium text-slate-400">Surging / steady / cooling</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
