import fs from "fs";

const s = fs.readFileSync("src/App.tsx", "utf8");
const marker = "if (!user) {\n    return (";
const start = s.indexOf(marker);
if (start < 0) throw new Error("landing start");
const i1 = start + marker.length;
const endToken = "</main>\n    );\n  }\n\n  return";
const i2 = s.indexOf(endToken, i1);
if (i2 < 0) throw new Error("landing end");
const jsx = s.slice(i1, i2 + "</main>".length);
fs.writeFileSync("src/pages/_landing_jsx.txt", jsx);
console.log("landing jsx len", jsx.length);
