import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
export default async function Home(){ const u=await getCurrentUser(); redirect(u?"/channels":"/login"); }