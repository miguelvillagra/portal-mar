import { NextResponse } from "next/server";

const ACCESS_COOKIE = process.env.ACCESS_COOKIE || "mar_access";
const REFRESH_COOKIE = process.env.REFRESH_COOKIE || "mar_refresh";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ACCESS_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  res.cookies.set(REFRESH_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}

