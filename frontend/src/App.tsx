import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { api } from "./env";
import "./index.css";
import { AuthPage } from "./pages/AuthPage";
import { DashboardPage } from "./pages/DashboardPage";
import type { DashboardNotice, DashboardView } from "./pages/DashboardPage";
import { LandingPage } from "./pages/LandingPage";
import { PublicSectionPage } from "./pages/PublicSectionPage";
import type { AiPlan, AnalyticsOverview, Claim, Donation, FeedFilter, Role, User } from "./types/foodshare";
import { demoCredentials } from "./types/foodshare";

export default function App() {
  return (
    <BrowserRouter>
      <ShareBiteApp />
    </BrowserRouter>
  );
}

function ShareBiteApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState(localStorage.getItem("foodshare_token") || localStorage.getItem("sharebite_token") || "");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [role, setRole] = useState<Role>("donor");
  const [isBooting, setIsBooting] = useState(Boolean(token));
  const [donations, setDonations] = useState<Donation[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [search, setSearch] = useState("");
  const [aiPlan, setAiPlan] = useState<AiPlan | null>(null);
  const [selectedDonationId, setSelectedDonationId] = useState("");
  const [selectedClaimId, setSelectedClaimId] = useState("");
  const [notice, setNotice] = useState<DashboardNotice>(null);
  const [authError, setAuthError] = useState("");
  const [feedFilter, setFeedFilter] = useState<FeedFilter>("all");

  const authHeaders = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);
  const selectedDemo = demoCredentials[role];

  const refresh = useCallback(
    async (nextToken = token) => {
      if (!nextToken) return;
      const headers = { Authorization: `Bearer ${nextToken}` };
      const me = await api.get("/me", { headers });
      const nextUser = me.data.user as User;
      const donationScope = nextUser.role === "receiver" ? "available" : "my";
      const [list, stats, claimList] = await Promise.all([
        api.get(`/donations?scope=${donationScope}`, { headers }),
        api.get("/analytics/overview", { headers }),
        api.get("/claims", { headers })
      ]);
      setUser(nextUser);
      setDonations(list.data.donations);
      setAnalytics(stats.data);
      setClaims(claimList.data.claims);
    },
    [token]
  );

  function logout() {
    localStorage.removeItem("foodshare_token");
    localStorage.removeItem("sharebite_token");
    setToken("");
    setUser(null);
    navigate("/");
  }

  useEffect(() => {
    const id = window.setTimeout(() => {
      void refresh()
        .catch(() => {
          localStorage.removeItem("foodshare_token");
          localStorage.removeItem("sharebite_token");
          setToken("");
          setUser(null);
        })
        .finally(() => setIsBooting(false));
    }, 0);
    return () => window.clearTimeout(id);
  }, [refresh]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (!token) return;
    const id = window.setTimeout(() => void refresh(), 0);
    return () => window.clearTimeout(id);
  }, [location.pathname, refresh, token]);

  useEffect(() => {
    if (!token) return;
    const sync = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    window.addEventListener("focus", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      window.removeEventListener("focus", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [refresh, token]);

  useEffect(() => {
    if (!notice) return;
    const id = window.setTimeout(() => setNotice(null), 6500);
    return () => window.clearTimeout(id);
  }, [notice]);

  function switchAuthMode(nextMode: "login" | "register", nextRole = role) {
    setAuthMode(nextMode);
    setRole(nextRole);
    setAuthError("");
  }

  function goToAuth(mode: "login" | "register", nextRole = role) {
    switchAuthMode(mode, nextRole);
    navigate(`/${mode}`);
  }

  async function handleAuth(event: React.FormEvent<HTMLFormElement>, requestedMode = authMode) {
    event.preventDefault();
    setAuthError("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim().toLowerCase();
    const password = String(form.get("password") || "");
    const payload =
      requestedMode === "login"
        ? { email, password }
        : {
            name: String(form.get("name") || "").trim(),
            email,
            password,
            role,
            location: String(form.get("location") || "").trim()
          };

    try {
      const endpoint = requestedMode === "login" ? "/auth/login" : "/auth/register";
      const { data } = await api.post(endpoint, payload, {
        headers: { "Content-Type": "application/json" }
      });
      localStorage.setItem("foodshare_token", data.token);
      setToken(data.token);
      setUser(data.user);
      await refresh(data.token);
      navigate(`/${data.user.role}/overview`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setAuthError(
          [error.response?.data?.message, error.response?.data?.hint].filter(Boolean).join(" ") ||
            (requestedMode === "login"
              ? "Could not sign in. Check email and password."
              : "Could not create the account. Fill every field (name and location need at least 2 characters).")
        );
        return;
      }
      setAuthError(requestedMode === "login" ? "Could not sign in." : "Could not create the account.");
    }
  }

  async function addDonation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(event.currentTarget);
    const expiresAt = new Date(Date.now() + Number(form.get("hours")) * 60 * 60 * 1000).toISOString();
    const title = String(form.get("title"));
    try {
      await api.post(
        "/donations",
        {
          title,
          category: String(form.get("category")),
          quantity: Number(form.get("quantity")),
          location: String(form.get("location")),
          donorPhone: String(form.get("donorPhone")),
          pickupWindow: String(form.get("pickupWindow")),
          expiresAt,
          notes: String(form.get("notes"))
        },
        { headers: authHeaders }
      );
      formElement.reset();
      setNotice({
        tone: "success",
        title: "Food published successfully",
        body: `${title || "Your food listing"} is now live for receivers to discover and claim.`
      });
      void refresh();
    } catch (error) {
      setNotice({
        tone: "error",
        title: "Food was not published",
        body: axios.isAxiosError(error)
          ? error.response?.data?.message || "Please check the listing details and try again."
          : "Please check the listing details and try again."
      });
    }
  }

  async function claimFood(id: string) {
    try {
      setSelectedDonationId(id);
      const { data } = await api.post(`/donations/${id}/claim`, {}, { headers: authHeaders });
      setAiPlan(data.aiPlan);
      setNotice({
        tone: "success",
        title: "Claim request sent",
        body:
          data.message ||
          `The donor has been asked to approve this pickup. AI dispatch generated a ${data.aiPlan.etaMinutes} min ETA and INR ${data.aiPlan.estimatedCostInr} pickup cost.`
      });
      await refresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setNotice({
          tone: "error",
          title: "Food was not claimed",
          body: error.response?.data?.message || "Could not claim this listing. Please refresh and try again."
        });
        return;
      }
      setNotice({
        tone: "error",
        title: "Food was not claimed",
        body: "Could not claim this listing. Please refresh and try again."
      });
    }
  }

  async function reviewClaim(id: string, decision: "approve" | "reject") {
    try {
      const { data } = await api.post(`/claims/${id}/${decision}`, {}, { headers: authHeaders });
      setNotice({
        tone: "success",
        title: decision === "approve" ? "Claim approved" : "Claim rejected",
        body:
          data.message ||
          (decision === "approve"
            ? "The receiver can now see that their pickup was approved."
            : "The receiver can now see that their pickup was rejected.")
      });
      await refresh();
    } catch (error) {
      setNotice({
        tone: "error",
        title: "Request was not updated",
        body: axios.isAxiosError(error) ? error.response?.data?.message || "Please refresh and try again." : "Please refresh and try again."
      });
    }
  }

  async function verifyClaimCode(id: string, code: string) {
    try {
      const { data } = await api.post(`/claims/${id}/verify-code`, { code }, { headers: authHeaders });
      setNotice({
        tone: "success",
        title: "Food successfully claimed",
        body: data.message || "The pickup code was verified and the claim is now complete."
      });
      setSelectedClaimId(id);
      await refresh();
    } catch (error) {
      setNotice({
        tone: "error",
        title: "Code was not accepted",
        body: axios.isAxiosError(error) ? error.response?.data?.message || "Check the 6 digit code and try again." : "Check the 6 digit code and try again."
      });
    }
  }

  async function estimate(target?: Donation | Claim) {
    const sample = target || donations.find((item) => item.id === selectedDonationId) || donations[0] || claims[0];
    if ("donation_id" in (sample || {})) {
      setSelectedClaimId((sample as Claim).id);
    } else if (sample?.id) {
      setSelectedDonationId(sample.id);
      setSelectedClaimId("");
    }
    const { data } = await api.post(
      "/ai/estimate",
      {
        origin: sample?.location || "Kukatpally, Hyderabad",
        destination: user?.role === "receiver" ? user!.location : "Nearest receiver hub, Hyderabad",
        food: sample?.title || "Packed meals",
        quantity: sample?.quantity || 30,
        pickupWindow: sample?.pickup_window || "Today evening"
      },
      { headers: authHeaders }
    );
    setAiPlan(data.plan);
  }

  const filtered = donations.filter((item) => `${item.title} ${item.location} ${item.category}`.toLowerCase().includes(search.toLowerCase()));
  const myListings = useMemo(
    () => (user ? donations.filter((d) => d.donor_id === user.id && d.status !== "expired") : []),
    [donations, user]
  );
  const receiverFeed = useMemo(() => {
    const match = (re: RegExp) => filtered.filter((item) => re.test(`${item.title} ${item.category}`.toLowerCase()));
    if (feedFilter === "cooked") return match(/biryani|rice|meal|cooked|curry|paneer|chicken|thali/);
    if (feedFilter === "bakery") return match(/bread|cake|bakery|pastry|bun|croissant/);
    if (feedFilter === "produce") return match(/fruit|veg|produce|salad|greens/);
    return filtered;
  }, [filtered, feedFilter]);
  const donorLiveSkus = useMemo(() => myListings.filter((d) => d.status === "available").length, [myListings]);
  const donorMealsOnShelf = useMemo(() => myListings.filter((d) => d.status === "available").reduce((a, d) => a + d.quantity, 0), [myListings]);
  const donorUrgentSkus = useMemo(
    () =>
      myListings.filter((d) => {
        // eslint-disable-next-line react-hooks/purity -- relative expiry needs current clock
        const h = (new Date(d.expires_at).getTime() - Date.now()) / 3600000;
        return h > 0 && h < 6;
      }).length,
    [myListings]
  );
  const trend = analytics?.monthlyTrend || [];
  const selectedClaim = claims.find((claim) => claim.id === selectedClaimId) || claims[0];
  const selectedDonation = donations.find((item) => item.id === selectedDonationId) || donations[0];
  const activeAiPlan = selectedClaimId ? selectedClaim?.ai_plan || aiPlan : aiPlan || selectedClaim?.ai_plan;
  const activeContextTitle = selectedClaim?.title || selectedDonation?.title || "No listing selected";
  const activeOrigin = selectedClaim?.location || selectedDonation?.location || "Pickup origin pending";
  const activeDestination = user?.role === "receiver" ? user.location : selectedClaim?.receiver_location || "Receiver hub pending";
  const availableMeals = filtered.reduce((total, item) => total + item.quantity, 0);
  const claimedMeals = claims.reduce((total, item) => total + item.quantity, 0);
  const forecastData =
    user?.role === "donor"
    ? [
        { area: "NGOs", claims: Math.max(18, claims.length * 6 + 18) },
        { area: "Hostels", claims: Math.max(24, availableMeals || 24) },
        { area: "Shelters", claims: Math.max(15, Math.round((analytics?.meals_shared || 42) * 0.35)) },
        { area: "Volunteers", claims: Math.max(12, myListings.length * 9 + 12) }
      ]
    : [
        { area: "North", claims: Math.max(8, claims.length * 5 + 12) },
        { area: "Central", claims: Math.max(14, claimedMeals || 18) },
        { area: "West", claims: Math.max(10, Math.round(availableMeals * 0.45) || 10) },
        { area: "East", claims: Math.max(9, Math.round(availableMeals * 0.32) || 9) }
      ];

  function renderDashboard(view: DashboardView, requiredRole: Role) {
    if (isBooting) {
      return <main className="grid min-h-dvh place-items-center bg-slate-950 text-sm font-bold text-slate-200">Opening workspace...</main>;
    }
    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== requiredRole) return <Navigate to={`/${user.role}/overview`} replace />;
    return (
      <DashboardPage
        view={view}
        user={user}
        notice={notice}
        onDismissNotice={() => setNotice(null)}
        onLogout={logout}
        onRefresh={() => void refresh()}
        onNavigate={navigate}
        donorLiveSkus={donorLiveSkus}
        donorMealsOnShelf={donorMealsOnShelf}
        donorUrgentSkus={donorUrgentSkus}
        receiverFeed={receiverFeed}
        claimedMeals={claimedMeals}
        analytics={analytics}
        claims={claims}
        myListings={myListings}
        selectedDonationId={selectedDonationId}
        setSelectedDonationId={setSelectedDonationId}
        onAddDonation={addDonation}
        search={search}
        setSearch={setSearch}
        feedFilter={feedFilter}
        setFeedFilter={setFeedFilter}
        onEstimate={estimate}
        onClaimFood={claimFood}
        onReviewClaim={reviewClaim}
        onVerifyClaimCode={verifyClaimCode}
        selectedClaimId={selectedClaimId}
        setSelectedClaimId={setSelectedClaimId}
        activeAiPlan={activeAiPlan}
        activeContextTitle={activeContextTitle}
        activeOrigin={activeOrigin}
        activeDestination={activeDestination}
        trend={trend}
        forecastData={forecastData}
        availableMeals={availableMeals}
      />
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <LandingPage
            page="home"
            onGoToAuth={goToAuth}
            onNavigate={navigate}
          />
        }
      />
      <Route path="/personas" element={<PublicSectionPage page="personas" onGoToAuth={goToAuth} onNavigate={navigate} />} />
      <Route path="/ai-stack" element={<PublicSectionPage page="ai-stack" onGoToAuth={goToAuth} onNavigate={navigate} />} />
      <Route path="/platform" element={<PublicSectionPage page="platform" onGoToAuth={goToAuth} onNavigate={navigate} />} />
      <Route path="/proof" element={<PublicSectionPage page="proof" onGoToAuth={goToAuth} onNavigate={navigate} />} />
      <Route
        path="/login"
        element={
          <AuthPage
            mode="login"
            role={role}
            selectedDemo={selectedDemo}
            authError={authError}
            onSetRole={setRole}
            onSubmitAuth={(event) => handleAuth(event, "login")}
            onNavigate={navigate}
          />
        }
      />
      <Route
        path="/register"
        element={
          <AuthPage
            mode="register"
            role={role}
            selectedDemo={selectedDemo}
            authError={authError}
            onSetRole={setRole}
            onSubmitAuth={(event) => handleAuth(event, "register")}
            onNavigate={navigate}
          />
        }
      />
      <Route path="/donor" element={<Navigate to="/donor/overview" replace />} />
      <Route path="/donor/overview" element={renderDashboard("overview", "donor")} />
      <Route path="/donor/donations" element={renderDashboard("workspace", "donor")} />
      <Route path="/donor/route-ai" element={renderDashboard("route-ai", "donor")} />
      <Route path="/donor/activity" element={renderDashboard("activity", "donor")} />
      <Route path="/donor/analytics" element={renderDashboard("analytics", "donor")} />
      <Route path="/receiver" element={<Navigate to="/receiver/overview" replace />} />
      <Route path="/receiver/overview" element={renderDashboard("overview", "receiver")} />
      <Route path="/receiver/feed" element={renderDashboard("workspace", "receiver")} />
      <Route path="/receiver/route-ai" element={renderDashboard("route-ai", "receiver")} />
      <Route path="/receiver/claims" element={renderDashboard("activity", "receiver")} />
      <Route path="/receiver/impact" element={renderDashboard("analytics", "receiver")} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
