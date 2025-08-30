

export function titleCase(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

// lib/format.ts
export function fmtPYG(value: number | string | null | undefined) {
  const n = typeof value === "string" ? parseFloat(value) : value ?? 0;
  return new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG",
    maximumFractionDigits: 0,
  }).format(isFinite(n as number) ? (n as number) : 0);
}

export function fmtDateTime(
  iso: string | null | undefined,
  tz: string = "America/Asuncion"
) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleString("es-PY", {
    timeZone: tz,
    dateStyle: "short",
    timeStyle: "short",
  });
}
