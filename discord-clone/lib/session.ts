import { cookies } from "next/headers";
import { db } from "@/lib/prisma";
const COOKIE = "discord_clone_user";
export async function getCurrentUser() {
  const id = cookies().get(COOKIE)?.value;
  if (!id) return null;
  return db.user.findUnique({ where: { id } });
}
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}
export function sessionCookie(id: string) {
  return { name: COOKIE, value: id, httpOnly: true, sameSite: "lax" as const, path: "/" };
}