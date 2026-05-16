import fs from "fs";

const s = fs.readFileSync("src/App.tsx", "utf8");

function sliceBetween(startPat, endPat) {
  const a = s.indexOf(startPat);
  if (a < 0) throw new Error("start " + startPat);
  const b = s.indexOf(endPat, a + startPat.length);
  if (b < 0) throw new Error("end " + endPat);
  return s.slice(a, b).trim();
}

fs.mkdirSync("src/components/landing", { recursive: true });

const lp = sliceBetween("function LandingPersonas(", "function LandingAiStack(");
fs.writeFileSync("src/components/landing/LandingPersonas.tsx", lp + "\n");

const la = sliceBetween("function LandingAiStack(", "function LandingProof(");
fs.writeFileSync("src/components/landing/LandingAiStack.tsx", la + "\n");

const lpr = sliceBetween("function LandingProof(", "function App(");
fs.writeFileSync("src/components/landing/LandingProof.tsx", lpr + "\n");

const mk = sliceBetween("function Marketing(", "\nexport default App");
fs.writeFileSync("src/components/landing/Marketing.tsx", mk + "\n");

fs.mkdirSync("src/components/dashboard", { recursive: true });
const cb = sliceBetween("function ClaimBoard(", "function Metric(");
fs.writeFileSync("src/components/dashboard/ClaimBoard.tsx", cb + "\n");

console.log("extracted");
