import type { FormEvent } from "react";
import {
  AlertCircle,
  Banknote,
  BarChart3,
  Brain,
  Building2,
  CheckCircle2,
  Clock3,
  Compass,
  Flame,
  Gauge,
  HandHeart,
  Leaf,
  LogOut,
  Map,
  MapPin,
  Navigation,
  PackageCheck,
  PackagePlus,
  Radar,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  Truck,
  UserRound,
  Utensils
} from "lucide-react";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Brand } from "../components/Brand";
import { ClaimBoard } from "../components/dashboard/ClaimBoard";
import { AiMetric } from "../components/ui/AiMetric";
import { Stat } from "../components/ui/Stat";
import { cn } from "../cn";
import { hoursUntil, handoffReadiness } from "../lib/format";
import type { AiPlan, AnalyticsOverview, Claim, Donation, FeedFilter, User } from "../types/foodshare";

export type DashboardView = "overview" | "workspace" | "route-ai" | "activity" | "analytics";
export type DashboardNotice = { tone: "success" | "error"; title: string; body: string } | null;

export type DashboardPageProps = {
  view: DashboardView;
  user: User;
  notice: DashboardNotice;
  onDismissNotice: () => void;
  onLogout: () => void;
  onRefresh: () => void;
  onNavigate: (path: string) => void;
  donorLiveSkus: number;
  donorMealsOnShelf: number;
  donorUrgentSkus: number;
  receiverFeed: Donation[];
  claimedMeals: number;
  analytics: AnalyticsOverview | null;
  claims: Claim[];
  myListings: Donation[];
  selectedDonationId: string;
  setSelectedDonationId: (id: string) => void;
  onAddDonation: (e: FormEvent<HTMLFormElement>) => void;
  search: string;
  setSearch: (s: string) => void;
  feedFilter: FeedFilter;
  setFeedFilter: (f: FeedFilter) => void;
  onEstimate: (target?: Donation | Claim) => void;
  onClaimFood: (id: string) => void;
  onReviewClaim: (id: string, decision: "approve" | "reject") => void;
  onVerifyClaimCode: (id: string, code: string) => void;
  selectedClaimId: string;
  setSelectedClaimId: (id: string) => void;
  activeAiPlan: AiPlan | null;
  activeContextTitle: string;
  activeOrigin: string;
  activeDestination: string;
  trend: { month: string; meals: number }[];
  forecastData: { area: string; claims: number }[];
  availableMeals: number;
};

export function DashboardPage(p: DashboardPageProps) {
  const {
    view,
    user,
    notice,
    onDismissNotice,
    onLogout,
    onRefresh,
    onNavigate,
    donorLiveSkus,
    donorMealsOnShelf,
    donorUrgentSkus,
    receiverFeed,
    claimedMeals,
    analytics,
    claims,
    myListings,
    selectedDonationId,
    setSelectedDonationId,
    onAddDonation,
    search,
    setSearch,
    feedFilter,
    setFeedFilter,
    onEstimate,
    onClaimFood,
    onReviewClaim,
    onVerifyClaimCode,
    selectedClaimId,
    setSelectedClaimId,
    activeAiPlan,
    activeContextTitle,
    activeOrigin,
    activeDestination,
    trend,
    forecastData,
    availableMeals
  } = p;
  const basePath = `/${user.role}`;
  const navClass = (target: DashboardView) =>
    cn(
      "flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-3 text-left text-sm font-bold transition sm:min-w-[140px] lg:w-full lg:min-w-0",
      view === target ? "bg-white/10 text-white ring-1 ring-white/10" : "text-slate-400 hover:bg-white/5 hover:text-white"
    );
  const showOverview = view === "overview" || view === "analytics";
  const showWorkspace = view === "workspace";
  const showRouteAi = view === "route-ai" || view === "analytics";
  const showActivity = view === "activity" || view === "analytics";
  const pendingDonorClaims = claims.filter((claim) => claim.status === "pending");

  return (
    <main
      className={cn(
        "grid min-h-dvh min-w-0 w-full max-w-[100dvw] overflow-x-clip font-sans lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]",
        user.role === "donor"
          ? "bg-gradient-to-br from-amber-50/90 via-stone-50 to-emerald-50/35"
          : "bg-gradient-to-br from-sky-50/90 via-slate-50 to-teal-50/30"
      )}
    >
      <aside
        className={cn(
          "flex min-h-0 min-w-0 flex-col gap-5 border-b px-4 py-5 sm:px-5 lg:sticky lg:top-0 lg:h-svh lg:min-h-0 lg:border-b-0 lg:border-r lg:py-6",
          user.role === "donor"
            ? "border-amber-900/25 bg-gradient-to-b from-stone-950 via-stone-900 to-amber-950 text-slate-100"
            : "border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-slate-100"
        )}
      >
        <Brand variant={user.role} />
        <nav className="flex min-w-0 flex-nowrap gap-2 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:flex-col lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            className={navClass("overview")}
            onClick={() => onNavigate(`${basePath}/overview`)}
          >
            <BarChart3 className="size-[18px] shrink-0" /> Overview
          </button>
          <button
            type="button"
            className={navClass("workspace")}
            onClick={() => onNavigate(`${basePath}/${user.role === "donor" ? "donations" : "feed"}`)}
          >
            {user.role === "donor" ? <PackagePlus className="size-[18px] shrink-0" /> : <Utensils className="size-[18px] shrink-0" />}{" "}
            {user.role === "donor" ? "Donations" : "Food Feed"}
          </button>
          <button
            type="button"
            className={navClass("route-ai")}
            onClick={() => onNavigate(`${basePath}/route-ai`)}
          >
            <Map className="size-[18px] shrink-0" /> Route AI
          </button>
          <button
            type="button"
            className={navClass("activity")}
            onClick={() => onNavigate(`${basePath}/${user.role === "donor" ? "activity" : "claims"}`)}
          >
            {user.role === "donor" ? <Building2 className="size-[18px] shrink-0" /> : <PackageCheck className="size-[18px] shrink-0" />}{" "}
            {user.role === "donor" ? "Demand" : "My Claims"}
          </button>
          <button
            type="button"
            className={navClass("analytics")}
            onClick={() => onNavigate(`${basePath}/${user.role === "donor" ? "analytics" : "impact"}`)}
          >
            <Leaf className="size-[18px] shrink-0" /> {user.role === "donor" ? "Analytics" : "Impact"}
          </button>
        </nav>
        <div className="mt-2 rounded-2xl border border-white/10 bg-gradient-to-br from-teal-500/15 to-blue-500/10 p-4 text-sm leading-relaxed text-slate-300">
          <Sparkles className="mb-2 size-[18px] text-teal-300" />
          <strong className="block text-white">{user.role === "donor" ? "Supply command" : "Mission control"}</strong>
          <p className="mt-1.5 text-[13px] text-slate-400">
            {user.role === "donor"
              ? "Publish with thermal + corridor context. AI scores every SKU before receivers commit."
              : "Triage listings by window, category, and AI readiness—then lock claims with one tap."}
          </p>
        </div>
        <div className="mt-auto grid gap-1.5 rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-slate-400">
          <span className="flex items-center gap-2 font-bold uppercase tracking-wider text-slate-500">
            <Gauge className="size-3.5" /> {user.role === "donor" ? "Ops tier" : "Field tier"}
          </span>
          <strong className="text-sm text-white">{user.role === "donor" ? "Enterprise donor" : "Verified receiver"}</strong>
          <small className="font-mono text-[11px] opacity-80">Neural dispatch v2 · JWT session</small>
        </div>
      </aside>

      <section className="min-h-0 min-w-0 px-3 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-5 sm:py-6 lg:px-8 lg:py-8">
        <header className="flex flex-col gap-5 rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-md sm:p-6 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <div className="min-w-0 max-w-3xl flex-1">
            <p
              className={cn(
                "mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider",
                user.role === "donor"
                  ? "border-orange-200 bg-orange-50 text-orange-900"
                  : "border-blue-200 bg-blue-50 text-blue-900"
              )}
            >
              <Radar className="size-4" /> {user.role === "donor" ? "Donor supply desk" : "Receiver pickup desk"}
            </p>
            <h1 className="text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {user.role === "donor" ? "Surplus command center" : "Rescue marketplace"}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">
              {user.role === "donor"
                ? `${user.name} — orchestrate listings, spoilage windows, and corridor demand from one glass surface.`
                : `${user.name} — prioritize high-velocity SKUs, preview neural ETAs, and lock compliant pickups.`}
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {(user.role === "donor"
                ? ["Multi-signal freshness scoring", "Demand surge + batching hints", "Audit-ready compliance strings"]
                : ["Category + window triage filters", "INR + vehicle class previews", "Live claim timeline with AI route"]
              ).map((label) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 sm:text-[13px]"
                >
                  <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600" /> {label}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap items-center gap-3 lg:shrink-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold capitalize text-slate-800 shadow-sm">
              <UserRound className="size-[17px] text-slate-500" /> {user.role}
            </span>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              onClick={onRefresh}
            >
              <RefreshCw className="size-[17px]" /> Refresh
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              onClick={onLogout}
            >
              <LogOut className="size-[17px]" /> Logout
            </button>
          </div>
        </header>

        {notice && (
          <div
            className={cn(
              "fixed inset-x-3 top-20 z-[70] mx-auto max-w-2xl rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-md sm:top-5 sm:px-5",
              notice.tone === "success"
                ? "border-emerald-200 bg-emerald-50/95 text-emerald-950 shadow-emerald-950/15"
                : "border-red-200 bg-red-50/95 text-red-950 shadow-red-950/15"
            )}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl",
                  notice.tone === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
                )}
              >
                {notice.tone === "success" ? <CheckCircle2 className="size-5" /> : <AlertCircle className="size-5" />}
              </span>
              <div className="min-w-0 flex-1">
                <strong className="block text-sm font-black sm:text-base">{notice.title}</strong>
                <p className="mt-1 text-sm font-semibold leading-relaxed opacity-85">{notice.body}</p>
              </div>
              <button
                type="button"
                className="rounded-lg px-2 py-1 text-xs font-black opacity-70 transition hover:bg-black/5 hover:opacity-100"
                onClick={onDismissNotice}
                aria-label="Dismiss notification"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {user.role === "donor" ? (
          <section className="mt-6 grid gap-4 sm:grid-cols-3" aria-label="Donor snapshot">
            <article className="rounded-2xl border border-orange-100 bg-white/90 p-5 shadow-lg shadow-orange-900/5 backdrop-blur-sm">
              <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-orange-700">
                <PackagePlus className="size-[15px]" /> Live SKUs
              </span>
              <strong className="mt-2 block text-3xl font-black tracking-tight text-slate-900">{donorLiveSkus}</strong>
              <p className="mt-2 text-sm text-slate-600">Listings currently discoverable by receivers.</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-lg backdrop-blur-sm">
              <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <Utensils className="size-[15px]" /> Meals on shelf
              </span>
              <strong className="mt-2 block text-3xl font-black tracking-tight text-slate-900">{donorMealsOnShelf.toLocaleString()}</strong>
              <p className="mt-2 text-sm text-slate-600">Total portions you have in market right now.</p>
            </article>
            <article className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-lg shadow-amber-900/10">
              <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-amber-800">
                <Flame className="size-[15px]" /> Urgent windows
              </span>
              <strong className="mt-2 block text-3xl font-black tracking-tight text-amber-950">{donorUrgentSkus}</strong>
              <p className="mt-2 text-sm text-amber-900/90">SKUs under six hours to expiry—refresh AI soon.</p>
            </article>
          </section>
        ) : (
          <section className="mt-6 grid gap-4 sm:grid-cols-3" aria-label="Receiver snapshot">
            <article className="rounded-2xl border border-blue-100 bg-white/90 p-5 shadow-lg shadow-blue-900/5 backdrop-blur-sm">
              <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-blue-700">
                <Search className="size-[15px]" /> Feed matches
              </span>
              <strong className="mt-2 block text-3xl font-black tracking-tight text-slate-900">{receiverFeed.length}</strong>
              <p className="mt-2 text-sm text-slate-600">Listings after search + category lens.</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-lg backdrop-blur-sm">
              <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <PackageCheck className="size-[15px]" /> Reserved meals
              </span>
              <strong className="mt-2 block text-3xl font-black tracking-tight text-slate-900">{claimedMeals.toLocaleString()}</strong>
              <p className="mt-2 text-sm text-slate-600">Across accepted claims in your workspace.</p>
            </article>
            <article className="rounded-2xl border border-teal-100 bg-white/90 p-5 shadow-lg backdrop-blur-sm">
              <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-teal-700">
                <MapPin className="size-[15px]" /> Coverage
              </span>
              <strong className="mt-2 block text-3xl font-black tracking-tight text-slate-900">{user.location.split(",")[0] || "Hub"}</strong>
              <p className="mt-2 text-sm text-slate-600">Primary intake geography for routing models.</p>
            </article>
          </section>
        )}

        {showOverview && <section className="mt-6 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4" id="overview">
          <Stat icon={user.role === "donor" ? <PackagePlus /> : <Utensils />} label={user.role === "receiver" ? "Meals available now" : "Meals listed by donors"} value={(user.role === "receiver" ? availableMeals : analytics?.meals_shared || 0).toLocaleString()} accent="green" role={user.role} />
          <Stat icon={user.role === "donor" ? <Building2 /> : <Truck />} label={user.role === "receiver" ? "My accepted claims" : "Receiver claims"} value={user.role === "receiver" ? claims.filter((claim) => claim.status !== "completed").length : analytics?.active_claims || 0} accent="blue" role={user.role} />
          <Stat icon={user.role === "donor" ? <Leaf /> : <PackageCheck />} label={user.role === "receiver" ? "Meals reserved" : "CO2 avoided"} value={user.role === "receiver" ? claimedMeals : `${analytics?.co2SavedKg || 0} kg`} accent="green" role={user.role} />
          <Stat icon={<Clock3 />} label={user.role === "receiver" ? "Next pickup ETA" : "Readiness ETA"} value={activeAiPlan ? `${activeAiPlan.etaMinutes} min` : "Select item"} accent="amber" role={user.role} />
        </section>}

        {showWorkspace && <section className="mt-8 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)] xl:gap-8" id="workspace">
          <div
            className={cn(
              "min-w-0 rounded-3xl border bg-white/95 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-sm sm:p-6",
              user.role === "donor" ? "border-orange-100 ring-1 ring-orange-500/10" : "border-blue-100 ring-1 ring-blue-500/10"
            )}
          >
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-brand-600">{user.role === "donor" ? "Inventory studio" : "Live rescue feed"}</p>
                <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                  {user.role === "donor" ? "Compose listings · monitor shelf health" : "Triage, preview AI, claim in seconds"}
                </h2>
              </div>
            </div>

            {user.role === "donor" ? (
              <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)] xl:gap-8">
                <div className="min-w-0 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/80 p-5 shadow-inner sm:p-6">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-orange-700">New listing</p>
                    <h3 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">Launch a corridor-ready SKU</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      Precise pickup windows and notes flow straight into neural dispatch, spoilage scoring, and compliance strings.
                    </p>
                  </div>
                  <form className="mt-5 grid gap-3" onSubmit={onAddDonation}>
                    <input
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                      name="title"
                      placeholder="Food title"
                      defaultValue="Fresh biryani meal boxes"
                      required
                    />
                    <input
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                      name="category"
                      placeholder="Category"
                      defaultValue="Cooked meals"
                      required
                    />
                    <input
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                      name="quantity"
                      type="number"
                      placeholder="Meal count"
                      defaultValue="30"
                      required
                    />
                    <input
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                      name="location"
                      placeholder="Pickup location"
                      defaultValue={user.location}
                      required
                    />
                    <input
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                      name="donorPhone"
                      type="tel"
                      placeholder="Donor phone number"
                      defaultValue="+91 "
                      minLength={7}
                      required
                    />
                    <input
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                      name="pickupWindow"
                      placeholder="Pickup window"
                      defaultValue="Today 7:00 PM - 9:00 PM"
                      required
                    />
                    <input
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                      name="hours"
                      type="number"
                      placeholder="Expires in hours"
                      defaultValue="6"
                      required
                    />
                    <textarea
                      className="min-h-[100px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                      name="notes"
                      placeholder="Packing, allergy, temperature, handoff instructions"
                    />
                    <button
                      type="submit"
                      className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-600/20 transition hover:brightness-110"
                    >
                      <PackagePlus className="size-[18px]" /> Publish to marketplace
                    </button>
                  </form>
                </div>
                <aside className="min-w-0 rounded-2xl border border-slate-700 bg-gradient-to-b from-slate-900 to-slate-950 p-5 text-slate-200 shadow-xl sm:p-5">
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-teal-300">Your shelf</p>
                      <h3 className="mt-1 text-lg font-bold text-white">Neural queue</h3>
                    </div>
                    <span className="w-fit rounded-full border border-teal-400/30 bg-teal-500/10 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wide text-teal-200">
                      {myListings.length} SKUs
                    </span>
                  </div>
                  {myListings.length === 0 ? (
                    <div className="py-4 text-sm leading-relaxed text-slate-400">No authored listings yet. Publish on the left — each SKU gets AI readiness + map previews.</div>
                  ) : (
                    <div className="grid max-h-[480px] gap-3 overflow-y-auto pr-1">
                      {myListings.map((item) => (
                        <div
                          key={item.id}
                          className={cn(
                            "rounded-xl border p-4 transition",
                            selectedDonationId === item.id
                              ? "border-teal-400/50 bg-teal-500/10 ring-1 ring-teal-400/30"
                              : "border-slate-600/80 bg-slate-800/40 hover:border-slate-500"
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={cn(
                                "rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide",
                                item.status === "available" ? "bg-emerald-500/20 text-emerald-200" : "bg-slate-600 text-slate-300"
                              )}
                            >
                              {item.status}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
                              <Clock3 className="size-3.5" /> {hoursUntil(item.expires_at)}
                            </span>
                          </div>
                          <strong className="mt-2 block text-white">{item.title}</strong>
                          <p className="mt-1 text-xs text-slate-400">
                            {item.quantity} meals · {item.category}
                          </p>
                          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                            <MapPin className="size-3.5 shrink-0" /> {item.location}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              type="button"
                              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-500 bg-slate-800/80 px-3 py-2 text-xs font-bold text-white transition hover:bg-slate-700 sm:flex-none"
                              onClick={() => onEstimate(item)}
                            >
                              <Brain className="size-4" /> Run AI
                            </button>
                            <button
                              type="button"
                              className="rounded-lg px-3 py-2 text-xs font-bold text-teal-300 underline-offset-2 hover:underline"
                              onClick={() => {
                                setSelectedDonationId(item.id);
                                onNavigate(`${basePath}/route-ai`);
                              }}
                            >
                              Map
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </aside>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-wrap gap-2" role="tablist" aria-label="Category lens">
                    {(["all", "cooked", "bakery", "produce"] as const).map((f) => (
                      <button
                        key={f}
                        type="button"
                        className={cn(
                          "min-h-10 rounded-full border px-4 py-2 text-sm font-bold transition",
                          feedFilter === f
                            ? "border-blue-500 bg-blue-600 text-white shadow-md shadow-blue-600/25"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                        )}
                        onClick={() => setFeedFilter(f)}
                      >
                        {f === "all" ? "All" : f[0].toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                  <div className="flex w-full min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 lg:max-w-md">
                    <Search className="size-[18px] shrink-0 text-slate-400" />
                    <input
                      className="min-w-0 flex-1 border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search food, donor, area"
                    />
                  </div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
                  {receiverFeed.map((item) => {
                    const urgent = hoursUntil(item.expires_at);
                    const readiness = handoffReadiness(item.id, item.quantity);
                    // eslint-disable-next-line react-hooks/purity -- urgency badge uses wall clock
                    const msLeft = new Date(item.expires_at).getTime() - Date.now();
                    const isHot = msLeft > 0 && msLeft < 2.5 * 3600000;
                    return (
                      <article
                        key={item.id}
                        className="relative min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 p-5 shadow-lg shadow-slate-900/5 transition [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:shadow-xl"
                      >
                        <div className="pointer-events-none absolute -inset-20 -top-24 bg-[radial-gradient(circle,rgba(59,130,246,0.12),transparent_65%)]" aria-hidden />
                        <div className="relative flex items-start justify-between gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-blue-800">
                            <Tag className="size-3" /> {item.category}
                          </span>
                          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black uppercase text-emerald-800">{item.status}</span>
                        </div>
                        <div className="relative mt-3 flex flex-wrap items-center justify-between gap-2">
                          <strong className="text-lg text-slate-900">{item.quantity} meals</strong>
                          <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-900">
                            <Gauge className="size-3.5" /> {readiness}% ready
                          </span>
                        </div>
                        <h3 className="relative mt-2 text-balance break-words text-xl font-bold tracking-tight text-slate-900">{item.title}</h3>
                        <div
                          className={cn(
                            "relative mt-3 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold",
                            isHot ? "border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-900" : "bg-slate-100 text-slate-600"
                          )}
                        >
                          <Flame className="size-3.5 shrink-0" /> {urgent} to expiry
                        </div>
                        <p className="relative mt-3 flex min-w-0 items-center gap-2 text-sm text-slate-600">
                          <Building2 className="size-4 shrink-0 text-slate-400" /> <span className="min-w-0 break-words">{item.donor_name}</span>
                        </p>
                        <p className="relative flex min-w-0 items-center gap-2 text-sm text-slate-600">
                          <MapPin className="size-4 shrink-0 text-slate-400" /> <span className="min-w-0 break-words">{item.location}</span>
                        </p>
                        <p className="relative flex min-w-0 items-center gap-2 text-sm text-slate-600">
                          <Clock3 className="size-4 shrink-0 text-slate-400" /> <span className="min-w-0 break-words">{item.pickup_window}</span>
                        </p>
                        <div className="relative mt-4 grid gap-2 sm:grid-cols-2">
                          <button
                            type="button"
                            className="flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-800 transition hover:bg-slate-50"
                            onClick={() => onEstimate(item)}
                          >
                            Preview AI
                          </button>
                          <button
                            type="button"
                            className="flex min-h-11 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-md shadow-blue-600/25 transition hover:brightness-110"
                            onClick={() => onClaimFood(item.id)}
                          >
                            Request approval
                          </button>
                        </div>
                      </article>
                    );
                  })}
                  {!receiverFeed.length && (
                    <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-12 text-center text-sm font-semibold text-slate-600">
                      No listings for this lens. Try another category or clear search.
                    </div>
                  )}
                </div>
                <ClaimBoard
                  claims={claims}
                  selectedClaimId={selectedClaimId}
                  onSelectClaim={(claim) => setSelectedClaimId(claim.id)}
                  onVerifyCode={onVerifyClaimCode}
                />
              </>
            )}
          </div>

          <aside
            className={cn(
              "h-fit min-w-0 rounded-3xl border bg-white/95 p-5 shadow-xl backdrop-blur-sm sm:p-6",
              user.role === "donor" ? "border-orange-200/80 ring-1 ring-orange-500/10" : "border-blue-200/80 ring-1 ring-blue-500/10"
            )}
          >
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-wider text-brand-600">{user.role === "donor" ? "Donor AI readiness" : "Receiver AI dispatch"}</p>
                <h2 className="mt-1 text-lg font-extrabold text-slate-900 sm:text-xl">{user.role === "donor" ? "Can this be picked up?" : "Can I reach this pickup?"}</h2>
              </div>
              <button
                type="button"
                className="grid size-11 shrink-0 place-items-center rounded-xl bg-slate-900 text-white shadow-md transition hover:bg-slate-800"
                onClick={() => onEstimate()}
                title="Run AI estimate"
              >
                <Brain className="size-5" />
              </button>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Analyzing</span>
              <strong className="mt-1 block truncate text-slate-900">{activeContextTitle}</strong>
              <small className="mt-1 block text-xs leading-snug text-slate-500">
                {activeOrigin} to {activeDestination}
              </small>
            </div>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 px-4 py-4 text-center">
              <strong className="text-3xl font-black tracking-tight text-slate-900">{activeAiPlan ? `${Math.round(activeAiPlan.confidence * 100)}%` : "Waiting"}</strong>
              <span className="mt-1 block text-xs font-semibold text-slate-500">
                {activeAiPlan?.source === "openrouter" ? "OpenRouter AI confidence" : activeAiPlan ? "local estimator confidence" : "dispatch confidence"}
              </span>
            </div>
            <div className="mt-4 grid min-w-0 grid-cols-2 gap-3">
              <AiMetric icon={<Clock3 />} label="ETA" value={activeAiPlan ? `${activeAiPlan.etaMinutes} min` : "Run estimate"} />
              <AiMetric icon={<Navigation />} label="Distance" value={activeAiPlan ? `${activeAiPlan.distanceKm} km` : "Pending"} />
              <AiMetric icon={<Banknote />} label="Cost" value={activeAiPlan ? `INR ${activeAiPlan.estimatedCostInr}` : "Pending"} />
              <AiMetric icon={<ShieldCheck />} label="Risk" value={activeAiPlan?.spoilageRisk || "Pending"} />
            </div>
            {activeAiPlan && (
              <>
                <div className="mt-4 grid min-w-0 grid-cols-2 gap-2 sm:gap-3">
                  <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                    <p className="text-[10px] font-bold uppercase text-slate-500">Freshness</p>
                    <strong className="text-sm text-slate-900">{activeAiPlan.freshnessScore != null ? `${Math.round(activeAiPlan.freshnessScore)}/100` : "—"}</strong>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                    <p className="text-[10px] font-bold uppercase text-slate-500">Demand</p>
                    <strong className="text-sm text-slate-900">{activeAiPlan.demandSignal ? activeAiPlan.demandSignal : "—"}</strong>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                    <p className="text-[10px] font-bold uppercase text-slate-500">CO₂ est.</p>
                    <strong className="text-sm text-slate-900">{activeAiPlan.carbonKgSaved != null ? `${activeAiPlan.carbonKgSaved} kg` : "—"}</strong>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                    <p className="text-[10px] font-bold uppercase text-slate-500">Vehicle</p>
                    <strong className="text-xs font-bold leading-snug text-slate-900">{activeAiPlan.recommendedVehicle || "—"}</strong>
                  </div>
                </div>
                {activeAiPlan.neuralSummary && (
                  <div className="mt-3 rounded-xl border border-violet-200 bg-violet-50/80 px-3 py-3 text-sm leading-relaxed break-words text-violet-950">
                    <strong className="mb-1 block text-xs font-black uppercase text-violet-800">Neural summary</strong>
                    {activeAiPlan.neuralSummary}
                  </div>
                )}
                {(activeAiPlan.weatherRiskNote || activeAiPlan.batchingSuggestion) && (
                  <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm leading-relaxed break-words text-slate-800">
                    <strong className="mb-1 block text-xs font-black uppercase text-slate-600">Field brief</strong>
                    {[activeAiPlan.weatherRiskNote, activeAiPlan.batchingSuggestion].filter(Boolean).join(" ")}
                  </div>
                )}
                {activeAiPlan.complianceNotes && <p className="mt-3 break-words text-xs font-semibold leading-relaxed text-teal-800">{activeAiPlan.complianceNotes}</p>}
              </>
            )}
            <p className="mt-4 break-words text-sm leading-relaxed text-slate-600">
              {activeAiPlan?.pickupAdvice ||
                "Claim a listing or run an estimate to receive route, price, timing, and food-safety guidance for the next handoff."}
            </p>
            {activeAiPlan?.generatedAt && (
              <p className="mt-2 font-mono text-[11px] text-slate-400">
                Generated {new Date(activeAiPlan.generatedAt).toLocaleTimeString()} via {activeAiPlan.source === "openrouter" ? "OpenRouter" : "local estimator"}
              </p>
            )}
          </aside>
        </section>}

        {showRouteAi && <section className="mt-8 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] xl:gap-8" id="route-ai">
          <div className="min-w-0 rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-lg backdrop-blur-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-brand-600">{user.role === "donor" ? "Receiver reach map" : "Pickup mission map"}</p>
                <h2 className="mt-1 text-xl font-extrabold text-slate-900 sm:text-2xl">
                  {user.role === "donor" ? "Where your listing can be collected" : "Route from donor to your hub"}
                </h2>
              </div>
              <button
                type="button"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-50"
                onClick={() => onEstimate()}
              >
                <Compass className="size-[17px]" /> Estimate route
              </button>
            </div>
            <div className="relative h-[clamp(200px,min(70vw,280px),320px)] w-full max-w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-100 via-white to-teal-50/50 sm:h-[300px] lg:h-[340px]">
              <div className="absolute left-[8%] top-[48%] h-5 w-[82%] -rotate-[11deg] rounded-full bg-slate-900/15" />
              <div className="absolute left-[19%] top-[28%] h-4 w-[58%] rotate-[35deg] rounded-full bg-slate-900/12" />
              <div className="absolute left-[36%] top-[67%] h-4 w-1/2 -rotate-[36deg] rounded-full bg-slate-900/10" />
              <div className="absolute left-[14%] top-[52%] w-[72%] rotate-[-14deg] border-t-[5px] border-dashed border-brand-500 opacity-80 drop-shadow-md" />
              <span className="absolute left-[9%] top-[38%] flex items-center gap-2 rounded-full bg-orange-500 px-3 py-2 text-xs font-black text-white shadow-lg">
                <Utensils className="size-4" /> {user.role === "donor" ? "Your pickup" : "Donor"}
              </span>
              <span className="absolute bottom-[22%] right-[9%] flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-2 text-xs font-black text-white shadow-lg">
                <HandHeart className="size-4" /> {user.role === "donor" ? "Receiver hub" : "Your hub"}
              </span>
              <span className="absolute bottom-4 left-4 flex max-w-[calc(100%-2rem)] items-center gap-2 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-[11px] font-bold text-slate-800 shadow-md sm:text-xs">
                <Navigation className="size-4 shrink-0 text-brand-600" />{" "}
                <span className="line-clamp-2">{activeAiPlan?.bestRoute || "Select a listing to generate a route"}</span>
              </span>
              <span className="absolute right-2 top-2 flex max-w-[min(11rem,calc(100%-4.5rem))] items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1.5 text-[10px] font-black text-emerald-900 shadow-md sm:right-4 sm:top-4 sm:max-w-none sm:px-3 sm:py-2 sm:text-xs">
                <Banknote className="size-4 shrink-0" />{" "}
                <span className="min-w-0 truncate">{activeAiPlan ? `INR ${activeAiPlan.estimatedCostInr}` : "AI cost pending"}</span>
              </span>
            </div>
          </div>

          <div className="min-w-0 rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-lg backdrop-blur-sm sm:p-6">
            <div className="mb-4">
              <p className="text-xs font-black uppercase tracking-wider text-brand-600">{user.role === "donor" ? "Donor impact" : "Receiver impact"}</p>
              <h2 className="mt-1 text-xl font-extrabold text-slate-900 sm:text-2xl">
                {user.role === "donor" ? "Meals protected from waste" : "Meals secured for distribution"}
              </h2>
            </div>
            <div className="h-[210px] w-full min-w-0 max-w-full sm:h-[240px] lg:h-[270px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend}>
                  <defs>
                    <linearGradient id="foodshareMeals" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip />
                  <Area dataKey="meals" stroke="#0f766e" fill="url(#foodshareMeals)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>}

        {showActivity && <section className="mt-8 grid min-w-0 gap-6 lg:grid-cols-2" id="activity">
          <div className="min-w-0 rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-lg backdrop-blur-sm sm:p-6">
            <div className="mb-4">
              <p className="text-xs font-black uppercase tracking-wider text-brand-600">{user.role === "donor" ? "Donation activity" : "Accepted pickups"}</p>
              <h2 className="mt-1 text-xl font-extrabold text-slate-900 sm:text-2xl">{user.role === "donor" ? "Active donation pipeline" : "Your receiver claim board"}</h2>
            </div>
            <div className="grid gap-3">
              {user.role === "donor" ? (
                <>
                  {pendingDonorClaims.length > 0 && (
                    <div className="grid gap-3">
                      {pendingDonorClaims.map((claim) => (
                        <article key={claim.id} className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 shadow-sm">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-200 px-2.5 py-1 text-[11px] font-black uppercase text-amber-950">
                                Donor approval needed
                              </span>
                              <strong className="mt-2 block break-words text-slate-950">{claim.receiver_name} wants to claim {claim.title}</strong>
                              <p className="mt-1 text-sm text-slate-700">
                                {claim.quantity} meals | Pickup: {claim.location} | Receiver hub: {claim.receiver_location}
                              </p>
                            </div>
                            <div className="flex shrink-0 gap-2">
                              <button
                                type="button"
                                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700"
                                onClick={() => onReviewClaim(claim.id, "approve")}
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-black text-red-700 shadow-sm transition hover:bg-red-50"
                                onClick={() => onReviewClaim(claim.id, "reject")}
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                  {myListings.length ? (
                    myListings.slice(0, 5).map((item) => (
                      <button
                        type="button"
                        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-left transition hover:border-brand-300 hover:bg-white"
                        key={item.id}
                        onClick={() => onEstimate(item)}
                      >
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-brand-600 shadow-sm">
                          <PackageCheck className="size-[17px]" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <strong className="block truncate text-slate-900">{item.title}</strong>
                          <p className="text-sm leading-snug text-slate-600">
                            <span className="break-words">{item.quantity} meals at {item.location}</span>
                          </p>
                        </div>
                        <em className="shrink-0 font-black not-italic text-emerald-700">{item.status}</em>
                      </button>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm font-semibold text-slate-600">
                      Pipeline is quiet. Publish a SKU to populate this lane.
                    </div>
                  )}
                </>
              ) : (
                claims.slice(0, 5).map((claim) => (
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-left transition hover:border-blue-300 hover:bg-white"
                    key={claim.id}
                    onClick={() => setSelectedClaimId(claim.id)}
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-blue-600 shadow-sm">
                      <CheckCircle2 className="size-[17px]" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <strong className="block truncate text-slate-900">{claim.title}</strong>
                      <p className="text-sm leading-snug text-slate-600">
                        <span className="break-words">
                          {claim.ai_plan.etaMinutes} min ETA | INR {claim.ai_plan.estimatedCostInr}
                        </span>
                      </p>
                    </div>
                    <em
                      className={cn(
                        "shrink-0 font-black not-italic",
                        claim.status === "approved" ? "text-emerald-700" : claim.status === "rejected" ? "text-red-700" : "text-amber-700"
                      )}
                    >
                      {claim.status}
                    </em>
                  </button>
                ))
              )}
              {user.role === "receiver" && !claims.length && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm font-semibold text-slate-600">
                  No accepted pickup yet. Claim a listing from the marketplace above.
                </div>
              )}
            </div>
          </div>

          <div className="min-w-0 rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-lg backdrop-blur-sm sm:p-6">
            <div className="mb-4">
              <p className="text-xs font-black uppercase tracking-wider text-brand-600">{user.role === "donor" ? "Receiver demand" : "Pickup capacity"}</p>
              <h2 className="mt-1 text-xl font-extrabold text-slate-900 sm:text-2xl">{user.role === "donor" ? "Who can receive your surplus" : "Claim capacity by area"}</h2>
            </div>
            <div className="h-[200px] w-full min-w-0 max-w-full sm:h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={forecastData}>
                  <XAxis dataKey="area" axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip />
                  <Bar dataKey="claims" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>}
      </section>
    </main>
  );

}
