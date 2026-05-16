import axios from "axios";

/** Browser app — local Vite dev (reference for deploy / docs; not shown in UI) */
export const APP_URL_LOCAL = String(import.meta.env.VITE_APP_URL_LOCAL || "http://localhost:5173").replace(/\/$/, "");
/** Browser app — production deploy */
export const APP_URL_DEPLOYED = String(import.meta.env.VITE_APP_URL_DEPLOYED || "https://sharebite.vercel.app").replace(/\/$/, "");

/** API — local Express */
export const API_URL_LOCAL = String(import.meta.env.VITE_API_URL_LOCAL || "http://localhost:5000").replace(/\/$/, "");
/** API — hosted backend (e.g. Railway) */
export const API_URL_DEPLOYED = String(import.meta.env.VITE_API_URL_DEPLOYED || "https://sharebite-production.up.railway.app").replace(
  /\/$/,
  ""
);

function resolveApiBase(): string {
  const pinned = String(import.meta.env.VITE_API_URL || "").trim();
  if (pinned) return pinned.replace(/\/$/, "");
  return import.meta.env.DEV ? API_URL_LOCAL : API_URL_DEPLOYED;
}

export const api = axios.create({ baseURL: resolveApiBase() });
