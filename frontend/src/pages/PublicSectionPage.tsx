import { ArrowLeft, ArrowRight } from "lucide-react";
import { Brand } from "../components/Brand";
import { LandingAiStack } from "../components/landing/LandingAiStack";
import { LandingPersonas } from "../components/landing/LandingPersonas";
import { LandingProof } from "../components/landing/LandingProof";
import { Marketing } from "../components/landing/Marketing";
import { cn } from "../cn";
import type { PublicPage } from "./LandingPage";

export type PublicSectionPageProps = {
  page: Exclude<PublicPage, "home">;
  onGoToAuth: (mode: "login" | "register") => void;
  onNavigate: (path: string) => void;
};

const pageMeta: Record<Exclude<PublicPage, "home">, { title: string; kicker: string; copy: string; path: string }> = {
  personas: {
    title: "Separate flows for donors and receivers",
    kicker: "Role-based rescue operations",
    copy: "Donors publish surplus and monitor pickup readiness, while receivers browse food, claim listings, and track accepted orders.",
    path: "/personas"
  },
  "ai-stack": {
    title: "Neural routing, freshness, and demand signals",
    kicker: "AI dispatch layer",
    copy: "Every estimate combines food type, pickup window, quantity, corridor assumptions, vehicle advice, and safety guidance.",
    path: "/ai-stack"
  },
  platform: {
    title: "A working platform, not a brochure",
    kicker: "Product surface",
    copy: "The application has routed workspaces for overview, donations, feed, Route AI, claims, activity, analytics, and impact.",
    path: "/platform"
  },
  proof: {
    title: "Operational proof for food rescue teams",
    kicker: "Impact evidence",
    copy: "Track meals shared, claims, CO2 avoided, freshness, ETA, and route intelligence in a clear end-to-end flow.",
    path: "/proof"
  }
};

const navItems: { label: string; path: string; page: PublicPage }[] = [
  { label: "Home", path: "/", page: "home" },
  { label: "Donors & receivers", path: "/personas", page: "personas" },
  { label: "Neural stack", path: "/ai-stack", page: "ai-stack" },
  { label: "Platform", path: "/platform", page: "platform" },
  { label: "Proof", path: "/proof", page: "proof" }
];

export function PublicSectionPage({ page, onGoToAuth, onNavigate }: PublicSectionPageProps) {
  const meta = pageMeta[page];

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

      <header className="border-b border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <button
            type="button"
            className="mb-8 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
            onClick={() => onNavigate("/")}
          >
            <ArrowLeft className="size-4" /> Back to home
          </button>
          <p className="text-xs font-black uppercase tracking-wider text-brand-400">{meta.kicker}</p>
          <h1 className="mt-3 max-w-3xl text-balance text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{meta.title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">{meta.copy}</p>
        </div>
      </header>

      {page === "personas" && <LandingPersonas />}
      {page === "ai-stack" && <LandingAiStack />}
      {page === "platform" && <Marketing />}
      {page === "proof" && <LandingProof />}

      <section className="border-t border-white/10 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-white">Ready to use the actual workspace?</p>
            <p className="mt-1 text-sm text-slate-400">Log in as a donor or receiver and continue in the routed dashboard.</p>
          </div>
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-teal-600/25 transition hover:brightness-110"
            onClick={() => onGoToAuth("login")}
          >
            Open console <ArrowRight className="size-4" />
          </button>
        </div>
      </section>
    </main>
  );
}
