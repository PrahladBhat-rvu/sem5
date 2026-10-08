import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/prisma";
import DiscordShell from "@/components/discord-shell";
export default async function Channels(){
 const user=await getCurrentUser(); if(!user)redirect("/login");
 let servers=await db.server.findMany({where:{members:{some:{userId:user.id}}},include:{channels:{orderBy:{createdAt:"asc"}},members:{include:{user:true}}},orderBy:{createdAt:"asc"}});
 if(!servers.length){
   const s=await db.server.create({data:{name:"My Server",inviteCode:crypto.randomUUID().replaceAll("-","").slice(0,10),members:{create:{userId:user.id,role:"ADMIN"}},channels:{create:[{name:"general",type:"TEXT"},{name:"General",type:"AUDIO"}]}},include:{channels:true,members:{include:{user:true}}}});
   servers=[s];
 }
 const server=servers[0]; const channel=server.channels.find(c=>c.type==="TEXT")||server.channels[0];
 const messages=channel&&channel.type==="TEXT"?await db.message.findMany({where:{channelId:channel.id},include:{member:{include:{user:true}},reactions:{include:{user:true}}},orderBy:{createdAt:"desc"},take:50}):[];
 return <DiscordShell currentUser={user} initialServers={servers} initialServer={server} initialChannel={channel||null} initialMessages={messages.reverse()}/>;
}