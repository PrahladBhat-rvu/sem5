import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { sessionCookie } from "@/lib/session";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const clean = String(username || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 32);

  if (!clean || !password) {
    return NextResponse.json(
      { error: "Username and password are required" },
      { status: 400 }
    );
  }

  const user = await db.user.findUnique({
    where: { username: clean },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 }
    );
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 }
    );
  }

  const updatedUser = await db.user.update({
    where: { id: user.id },
    data: { status: "ONLINE" },
  });

  const r = NextResponse.json(updatedUser);
  r.cookies.set(sessionCookie(updatedUser.id));

  return r;
}