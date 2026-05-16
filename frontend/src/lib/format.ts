export function hoursUntil(iso: string) {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "—";
  const ms = t - Date.now();
  if (ms <= 0) return "Expired";
  if (ms < 3600000) return `${Math.max(1, Math.round(ms / 60000))}m`;
  return `${Math.round(ms / 3600000)}h`;
}

export function handoffReadiness(id: string, qty: number) {
  const seed = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return Math.min(98, 68 + (seed % 22) - Math.min(15, Math.floor(qty / 20)));
}
