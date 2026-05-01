import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username, password } = (await req.json()) as {
    username?: string;
    password?: string;
  };

  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    return NextResponse.json(
        { error: "Dev Login is not configured" },
        { status: 500 },
    );
  }
  
  if (username !== expectedUsername || password !== expectedPassword) {
    return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("blog_admin", "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path : "/",
    maxAge: 60 * 60 * 8 , // 7 days
  });

  return response;
  }