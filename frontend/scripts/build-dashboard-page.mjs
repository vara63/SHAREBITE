import fs from "fs";

let b = fs.readFileSync("src/pages/_dash_extract.txt", "utf8");
b = b.replace(/scrollToSection\(/g, "onScrollTo(");
b = b.replace(/onClick=\{logout\}/g, "onClick={onLogout}");
b = b.replace(/\bestimate\(/g, "onEstimate(");
b = b.replace(/\bclaimFood\(/g, "onClaimFood(");
b = b.replace(/onSubmit=\{addDonation\}/g, "onSubmit={onAddDonation}");

const header = `import type { FormEvent } from "react";
import {
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
  LogOut,
  Map,
  MapPin,
  Navigation,
  PackageCheck,
  PackagePlus,
  Radar,
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
import { hoursUntil } from "../lib/format";
import type { AiPlan, AnalyticsOverview, Claim, Donation, FeedFilter, User } from "../types/foodshare";

export type DashboardPageProps = {
  user: User;
  message: string;
  onLogout: () => void;
  onScrollTo: (id: string) => void;
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
    user,
    message,
    onLogout,
    onScrollTo,
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
`;

const out = `${header}\n${b}\n}\n`;
fs.writeFileSync("src/pages/DashboardPage.tsx", out);
console.log("ok", out.length);
