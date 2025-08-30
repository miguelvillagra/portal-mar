// lib/fetcher.ts
import { headers, cookies } from "next/headers";

/** Construye una URL absoluta al propio Next (http(s)://host/...) */
export async function abs(path: string) {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") || "http";
  const host = h.get("host")!;
  if (!path.startsWith("/")) path = "/" + path;
  return `${proto}://${host}${path}`;
}

/** Fetch para páginas SSR: URL absoluta + reenvío de cookies */
export async function getJSONServer(path: string) {
  const url = await abs(path);
  const c = await cookies();
  const ck = c.toString(); // incluye session/jwt de tu login
  const r = await fetch(url, {
    cache: "no-store",
    headers: ck ? { cookie: ck } : undefined,
  });
  if (!r.ok) throw new Error(`fetch failed ${r.status} for ${url}`);
  return r.json();
}
