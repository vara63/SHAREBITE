import type { FormEvent } from "react";
import { ArrowLeft, HandHeart, PackagePlus } from "lucide-react";
import { Brand } from "../components/Brand";
import { cn } from "../cn";
import type { Role } from "../types/foodshare";

export type AuthPageProps = {
  mode: "login" | "register";
  role: Role;
  selectedDemo: { email: string; password: string; label: string };
  authError: string;
  onSetRole: (role: Role) => void;
  onSubmitAuth: (event: FormEvent<HTMLFormElement>) => void;
  onNavigate: (path: string) => void;
};

export function AuthPage({ mode, role, selectedDemo, authError, onSetRole, onSubmitAuth, onNavigate }: AuthPageProps) {
  const isLogin = mode === "login";

  return (
    <main className="grid min-h-dvh place-items-center bg-slate-950 px-4 py-8 text-slate-900 sm:px-6">
      <section className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Brand />
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold text-slate-200 transition hover:bg-white/10"
            onClick={() => onNavigate("/")}
          >
            <ArrowLeft className="size-4" /> Home
          </button>
        </div>
        <form className="grid gap-4 rounded-3xl border border-white/10 bg-white p-6 shadow-2xl shadow-black/40 sm:p-8" onSubmit={onSubmitAuth} key={`${mode}-${role}`}>
          <p className="text-xs font-black uppercase tracking-wider text-brand-600">{isLogin ? selectedDemo.label : "Create workspace"}</p>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {isLogin ? `Open ${role === "donor" ? "Donor" : "Receiver"} Dashboard` : "Join FoodShare"}
          </h1>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              className={cn(
                "grid min-h-[5.25rem] grid-cols-[auto_1fr] items-center gap-x-3 rounded-2xl border-2 px-4 py-3 text-left transition",
                role === "donor" ? "border-orange-400 bg-orange-50 ring-2 ring-orange-400/30" : "border-slate-200 bg-slate-50 hover:border-slate-300"
              )}
              onClick={() => onSetRole("donor")}
            >
              <PackagePlus className="size-[18px] text-orange-600" />
              <span className="font-bold text-slate-900">Donor</span>
              <small className="col-span-2 text-xs text-slate-600">List surplus food</small>
            </button>
            <button
              type="button"
              className={cn(
                "grid min-h-[5.25rem] grid-cols-[auto_1fr] items-center gap-x-3 rounded-2xl border-2 px-4 py-3 text-left transition",
                role === "receiver" ? "border-blue-400 bg-blue-50 ring-2 ring-blue-400/30" : "border-slate-200 bg-slate-50 hover:border-slate-300"
              )}
              onClick={() => onSetRole("receiver")}
            >
              <HandHeart className="size-[18px] text-receiver-600" />
              <span className="font-bold text-slate-900">Receiver</span>
              <small className="col-span-2 text-xs text-slate-600">Claim available food</small>
            </button>
          </div>
          {!isLogin && (
            <input
              name="name"
              placeholder="Full name / organization"
              required
              minLength={2}
              maxLength={200}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          )}
          <input
            name="email"
            type="email"
            placeholder="Email address"
            defaultValue={isLogin ? selectedDemo.email : ""}
            required
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            defaultValue={isLogin ? selectedDemo.password : ""}
            minLength={6}
            required
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
          {!isLogin && (
            <input
              name="location"
              placeholder="Primary location / neighborhood"
              required
              minLength={2}
              maxLength={200}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          )}
          {authError && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{authError}</div>}
          <button
            type="submit"
            className="flex min-h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 py-3.5 text-base font-bold text-white shadow-lg shadow-teal-600/25 transition hover:brightness-110"
          >
            {isLogin ? `Log in as ${role}` : `Create ${role} account`}
          </button>
          <button
            className="border-0 bg-transparent text-center text-sm font-bold text-brand-700 underline-offset-2 hover:underline"
            type="button"
            onClick={() => onNavigate(isLogin ? "/register" : "/login")}
          >
            {isLogin ? "Need an account? Sign up" : "Already have an account? Log in"}
          </button>
        </form>
      </section>
    </main>
  );
}
