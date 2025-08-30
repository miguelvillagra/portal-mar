import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL!;
const ACCESS_COOKIE = process.env.ACCESS_COOKIE || "mar_access";
const REFRESH_COOKIE = process.env.REFRESH_COOKIE || "mar_refresh";
const ACCESS_MAX_AGE = parseInt(process.env.ACCESS_MAX_AGE || "3600");
const REFRESH_MAX_AGE = parseInt(process.env.REFRESH_MAX_AGE || "1209600");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const r = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await r.json();
    if (!r.ok) {
      return NextResponse.json({ error: data?.error || "login_failed" }, { status: r.status });
    }
    const res = NextResponse.json({ ok: true, user: data.user });
    res.cookies.set(ACCESS_COOKIE, data.access_token, {
      httpOnly: true, sameSite: "lax", secure: false, path: "/", maxAge: ACCESS_MAX_AGE,
    });
    res.cookies.set(REFRESH_COOKIE, data.refresh_token, {
      httpOnly: true, sameSite: "lax", secure: false, path: "/", maxAge: REFRESH_MAX_AGE,
    });
    return res;
  } catch (e) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
}

