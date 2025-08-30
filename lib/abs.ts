// lib/abs.ts
import { headers } from "next/headers";

/** Devuelve la URL absoluta para una ruta interna (e.g. /api/b/...) */
export function abs(path: string) {
  const h = headers();
  const host = h.get("host")!;
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}${path}`;
}
