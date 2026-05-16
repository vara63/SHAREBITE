import fs from "fs";

let jsx = fs.readFileSync("src/pages/_landing_jsx.txt", "utf8");
jsx = jsx.replace(/goToAuth\(/g, "onGoToAuth(");
jsx = jsx.replace(/switchAuthMode\(/g, "onSwitchAuthMode(");
jsx = jsx.replace(/onSubmit=\{handleAuth\}/g, "onSubmit={onSubmitAuth}");
jsx = jsx.replace(/onClick=\{\(\) => setRole\("donor"\)\}/g, 'onClick={() => onSetRole("donor")}');
jsx = jsx.replace(/onClick=\{\(\) => setRole\("receiver"\)\}/g, 'onClick={() => onSetRole("receiver")}');

const header = `import type { FormEvent } from "react";
import { ArrowRight, Cpu, HandHeart, LineChart, PackagePlus, Zap } from "lucide-react";
import { Brand } from "../components/Brand";
import { LandingAiStack } from "../components/landing/LandingAiStack";
import { LandingPersonas } from "../components/landing/LandingPersonas";
import { LandingProof } from "../components/landing/LandingProof";
import { Marketing } from "../components/landing/Marketing";
import { ProductVisual } from "../components/ProductVisual";
import { Metric } from "../components/ui/Metric";
import { cn } from "../cn";
import type { Role } from "../types/foodshare";

export type LandingPageProps = {
  authMode: "login" | "register";
  role: Role;
  onSetRole: (r: Role) => void;
  authError: string;
  selectedDemo: { email: string; password: string; label: string };
  onGoToAuth: (mode: "login" | "register") => void;
  onSubmitAuth: (e: FormEvent<HTMLFormElement>) => void;
  onSwitchAuthMode: (mode: "login" | "register") => void;
};

export function LandingPage(p: LandingPageProps) {
  const { authMode, role, onSetRole, authError, selectedDemo, onGoToAuth, onSubmitAuth, onSwitchAuthMode } = p;
`;

const out = `${header}\n  return (\n${jsx}\n  );\n}\n`;
fs.writeFileSync("src/pages/LandingPage.tsx", out);
console.log("ok", out.length);
