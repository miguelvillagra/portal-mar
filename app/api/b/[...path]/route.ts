// app/api/b/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL!;
const ACCESS_COOKIE = process.env.ACCESS_COOKIE || "mar_access";
const REFRESH_COOKIE = process.env.REFRESH_COOKIE || "mar_refresh";
const ACCESS_MAX_AGE = parseInt(process.env.ACCESS_MAX_AGE || "3600");

async function callBackend(path: string, req: NextRequest, token?: string) {
  const url = new URL(req.url);
  const qs = url.search;
  const target = `${BACKEND_URL}/api/v1/${path}${qs}`;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const method = req.method.toUpperCase();
  const hasBody = method === "POST" || method === "PATCH" || method === "PUT";
  const body = hasBody ? await req.text() : undefined;

  return fetch(target, { method, headers, body });
}

async function refreshAccessToken(req: NextRequest) {
  const refresh = req.cookies.get(REFRESH_COOKIE)?.value;
  if (!refresh) return null;
  const r = await fetch(`${BACKEND_URL}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refresh }),
  });
  if (!r.ok) return null;
  const data = await r.json();
  return data.access_token as string;
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;                 // 👈 await
  const token = req.cookies.get(ACCESS_COOKIE)?.value;

  let r = await callBackend(path.join("/"), req, token);
  if (r.status === 401) {
    const newToken = await refreshAccessToken(req);
    if (newToken) {
      r = await callBackend(path.join("/"), req, newToken);
      const data = await r.text();
      const res = new NextResponse(data, {
        status: r.status,
        headers: { "Content-Type": r.headers.get("Content-Type") || "application/json" },
      });
      res.cookies.set(ACCESS_COOKIE, newToken, {
        httpOnly: true, sameSite: "lax", secure: false, path: "/", maxAge: ACCESS_MAX_AGE,
      });
      return res;
    }
  }
  const data = await r.text();
  return new NextResponse(data, {
    status: r.status,
    headers: { "Content-Type": r.headers.get("Content-Type") || "application/json" },
  });
}

export const POST = GET;
export const PATCH = GET;
