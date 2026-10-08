import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
export async function POST(){const u=await getCurrentUser();if(u)await db.user.update({where:{id:u.id},data:{status:"OFFLINE"}});const r=NextResponse.json({ok:true});r.cookies.set("discord_clone_user","",{httpOnly:true,path:"/",maxAge:0});return r;}