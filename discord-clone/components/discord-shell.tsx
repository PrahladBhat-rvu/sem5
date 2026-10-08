"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useRouter } from "next/navigation";
import { Hash, Headphones, Plus, Settings, Sun, Moon, LogOut, Trash2, Pencil, Copy, Volume2, Video, ChevronDown, UserPlus, Search, Bell, Users, MessageCircle, Smile, Paperclip, Reply, MoreVertical, Shield, UserX, X, Menu, Mic, MicOff, VideoIcon, PhoneOff, Send, Upload, Image as ImageIcon } from "lucide-react";
import { useTheme } from "next-themes";

type User={id:string;username:string;avatar?:string|null;status:string;bio?:string|null};
type Channel={id:string;name:string;type:string;topic?:string|null;serverId:string};
type Member={id:string;role:string;user:User;userId:string};
type Server={id:string;name:string;imageUrl?:string|null;inviteCode:string;channels:Channel[];members:Member[]};
type Reaction={id:string;emoji:string;userId:string};
type Message={id:string;content:string;deleted:boolean;edited:boolean;createdAt:string;attachmentUrl?:string|null;attachmentName?:string|null;member:{user:User;id:string};reactions:Reaction[];replyToId?:string|null};
type DM={id:string;content:string;createdAt:string;sender:User;receiver:User};

const EMOJIS=["👍","❤️","😂","🎉","🔥","👀","🚀","😎"];
const roleRank=(r:string)=>r==="ADMIN"?3:r==="MODERATOR"?2:1;

export default function DiscordShell({currentUser,initialServers,initialServer,initialChannel,initialMessages}:{currentUser:User;initialServers:Server[];initialServer:Server;initialChannel:Channel|null;initialMessages:Message[]}){
 const router=useRouter(); const {theme,setTheme}=useTheme();
 const [servers,setServers]=useState(initialServers); const [server,setServer]=useState(initialServer); 
 const [channel,setChannel]=useState(initialChannel);
 const [messages,setMessages]=useState<Message[]>(initialMessages); const [socket,setSocket]=useState<Socket|null>(null);
 const [text,setText]=useState(""); const [serverMenu,setServerMenu]=useState(false); const [showMembers,setShowMembers]=useState(true);
 const [mobile,setMobile]=useState(false); const [serverModal,setServerModal]=useState(false); 
 const [channelModal,setChannelModal]=useState(false);
 const [settings,setSettings]=useState(false); const [serverName,setServerName]=useState(server.name); 
 const [channelName,setChannelName]=useState("");
 const [editing,setEditing]=useState<string|null>(null); const [editText,setEditText]=useState(""); 
 const [reply,setReply]=useState<Message|null>(null);
 const [typing,setTyping]=useState(""); const [uploading,setUploading]=useState(false); 
 const [dmUser,setDmUser]=useState<User|null>(null); const [dms,setDms]=useState<DM[]>([]);
 const [memberSearch,setMemberSearch]=useState(""); const [search,setSearch]=useState(""); 
 const [searchResults,setSearchResults]=useState<any[]>([]);
 const [notifications,setNotifications]=useState<any[]>([]); const [showSearch,setShowSearch]=useState(false); 
 const [showNotifs,setShowNotifs]=useState(false);
 const [call,setCall]=useState<{kind:"AUDIO"|"VIDEO";room:string}|null>(null);
 const bottomRef=useRef<HTMLDivElement>(null); const fileRef=useRef<HTMLInputElement>(null); const typingTimer=useRef<any>(null);

 useEffect(()=>{const s=io({path:"/api/socket"});setSocket(s);s.on("connect",()=>s.emit("presence",{userId:currentUser.id,username:currentUser.username}));s.on("typing",(d)=>{setTyping(d.username);clearTimeout(typingTimer.current);typingTimer.current=setTimeout(()=>setTyping(""),1600)});s.on("channel-created",(c)=>{if(c.serverId===server.id)setServer(x=>({...x,channels:[...x.channels,c]}))});s.on("reaction-changed",async()=>channel&&loadMessages(channel.id));s.on("dm-created",(m)=>{if(dmUser&&(m.senderId===dmUser.id||m.receiverId===dmUser.id))setDms(x=>[...x,m])});return()=>{s.disconnect()}},[]);
 useEffect(()=>{if(!socket||!channel)return;socket.emit("join-channel",channel.id);const created=(m:Message)=>setMessages(x=>x.some(a=>a.id===m.id)?x:[...x,m]);const updated=(m:Message)=>setMessages(x=>x.map(a=>a.id===m.id?m:a));const deleted=(m:Message)=>setMessages(x=>x.map(a=>a.id===m.id?m:a));socket.on("message-created",created);socket.on("message-updated",updated);socket.on("message-deleted",deleted);return()=>{socket.emit("leave-channel",channel.id);socket.off("message-created",created);socket.off("message-updated",updated);socket.off("message-deleted",deleted)}},[socket,channel?.id]);
 useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"})},[messages.length,dmUser?.id]);
 useEffect(()=>{fetch("/api/notifications").then(r=>r.ok?r.json():[]).then(setNotifications)},[]);
 async function loadMessages(id:string,before?:string){const r=await fetch(`/api/channels/${id}/messages?limit=50${before?`&before=${encodeURIComponent(before)}`:""}`);if(r.ok){const x=await r.json();setMessages(prev=>before?[...x.reverse(),...prev]:x.reverse())}}
 async function selectServer(s:Server){setServer(s);setServerName(s.name);const r=await fetch(`/api/servers/${s.id}/channels`);const cs=await r.json();setServer(x=>({...x,channels:cs}));const c=cs.find((x:any)=>x.type==="TEXT")||cs[0]||null;setChannel(c);setMessages([]);setDmUser(null);if(c?.type==="TEXT")loadMessages(c.id);setMobile(false)}
 async function selectChannel(c:Channel){setChannel(c);setDmUser(null);setMessages([]);if(c.type==="TEXT")loadMessages(c.id);setMobile(false)}
 async function createServer(){if(!serverName.trim())return;const r=await fetch("/api/servers",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:serverName})});if(r.ok){const s=await r.json();setServers(x=>[...x,s]);setServer(s);setChannel(s.channels[0]);setMessages([]);setServerModal(false)}}
 async function createChannel(){if(!channelName.trim())return;const r=await fetch(`/api/servers/${server.id}/channels`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:channelName,type:"TEXT"})});if(r.ok){const c=await r.json();setServer(x=>({...x,channels:[...x.channels,c]}));setChannel(c);setMessages([]);setChannelModal(false);setChannelName("")}}
 async function sendMessage(e?:React.FormEvent){e?.preventDefault();if(!channel||channel.type!=="TEXT"||(!text.trim()&&!reply))return;const content=text;setText("");const r=await fetch(`/api/channels/${channel.id}/messages`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({content,replyToId:reply?.id||null})});if(r.ok)setReply(null)}
 async function upload(file:File){if(!channel)return;setUploading(true);const f=new FormData();f.append("file",file);const r=await fetch("/api/upload",{method:"POST",body:f});if(r.ok){const a=await r.json();await fetch(`/api/channels/${channel.id}/messages`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:"",attachmentUrl:a.url,attachmentName:a.name})})}setUploading(false)}
 async function deleteMessage(id:string){await fetch(`/api/messages/${id}`,{method:"DELETE"})}
 async function saveEdit(id:string){await fetch(`/api/messages/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:editText})});setEditing(null)}
 async function react(id:string,emoji:string){const existing=messages.find(m=>m.id===id)?.reactions.find(r=>r.emoji===emoji&&r.userId===currentUser.id);await fetch(`/api/messages/${id}/reactions`,{method:existing?"DELETE":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({emoji})});loadMessages(channel!.id)}
 async function copyInvite(){await navigator.clipboard.writeText(`${location.origin}/invite/${server.inviteCode}`);alert("Invite link copied!")}
 async function logout(){await fetch("/api/auth/logout",{method:"POST"});router.push("/login");router.refresh()}
 async function openDM(u:User){setDmUser(u);setShowMembers(false);const r=await fetch(`/api/dms?userId=${u.id}`);if(r.ok)setDms(await r.json())}
 async function sendDM(e?:React.FormEvent){e?.preventDefault();if(!dmUser||!text.trim())return;const c=text;setText("");await fetch("/api/dms",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({receiverId:dmUser.id,content:c})})}
 async function doSearch(){if(!search.trim())return;const r=await fetch(`/api/search?q=${encodeURIComponent(search)}&serverId=${server.id}`);if(r.ok)setSearchResults(await r.json())}
 async function markNotifs(){await fetch("/api/notifications",{method:"PATCH"});setNotifications(x=>x.map(n=>({...n,read:true})))}
 const me=server.members.find(m=>m.userId===currentUser.id); const isAdmin=me?.role==="ADMIN"; const isMod=me?.role==="MODERATOR"||isAdmin;
 const textChannels=server.channels.filter(c=>c.type==="TEXT"), voiceChannels=server.channels.filter(c=>c.type==="AUDIO"), videoChannels=server.channels.filter(c=>c.type==="VIDEO");
 const filteredMembers=server.members.filter(m=>m.user.username.toLowerCase().includes(memberSearch.toLowerCase()));
 const unread=notifications.filter(n=>!n.read).length;

 return <div className="flex h-screen overflow-hidden bg-[#313338]">
  <aside className={`${mobile?"flex":"hidden"} md:flex w-[72px] shrink-0 bg-[#1e1f22] p-3 flex-col items-center gap-3`}>
   <button onClick={()=>router.push("/channels")} className="grid h-12 w-12 place-items-center rounded-2xl bg-[#5865f2] text-xl font-black">D</button><div className="h-px w-8 bg-white/10"/>
   {servers.map(s=><button key={s.id} onClick={()=>selectServer(s)} title={s.name} className={`grid h-12 w-12 place-items-center rounded-2xl font-bold ${s.id===server.id?"bg-[#5865f2] rounded-xl":"bg-[#313338] hover:bg-[#5865f2] hover:rounded-xl"}`}>{s.imageUrl?<img src={s.imageUrl} className="h-full w-full rounded-inherit object-cover"/>:s.name.slice(0,2).toUpperCase()}</button>)}
   <button onClick={()=>setServerModal(true)} className="grid h-12 w-12 place-items-center rounded-2xl bg-[#313338] text-[#23a559] hover:bg-[#23a559] hover:text-white"><Plus/></button>
   <div className="mt-auto space-y-2"><button onClick={()=>setTheme(theme==="dark"?"light":"dark")} className="grid h-12 w-12 place-items-center rounded-2xl bg-[#313338]">{theme==="dark"?<Sun size={19}/>:<Moon size={19}/>}</button></div>
  </aside>

  <aside className={`${mobile?"flex":"hidden"} md:flex w-64 shrink-0 bg-[#2b2d31] flex-col`}>
   <div className="h-14 px-4 flex items-center justify-between border-b border-black/20">
    <button onClick={()=>setServerMenu(x=>!x)} className="flex min-w-0 items-center gap-1 font-bold hover:text-white"><span className="truncate">{server.name}</span><ChevronDown size={17}/></button>
    <div className="relative"><button onClick={()=>setShowNotifs(x=>!x)} className="relative text-[#b5bac1]"><Bell size={18}/>{unread>0&&<span className="absolute -right-2 -top-2 rounded-full bg-[#f23f42] px-1.5 text-[9px]">{unread}</span>}</button>{showNotifs&&<div className="absolute right-0 top-7 z-30 w-72 menu">{notifications.slice(0,8).map(n=><div key={n.id} className="border-b border-white/5 px-3 py-2"><p className="text-sm font-semibold">{n.title}</p><p className="text-xs text-[#b5bac1]">{n.body}</p></div>)}<button className="menuitem mt-1" onClick={markNotifs}>Mark all read</button></div>}</div>
   </div>
   {serverMenu&&<div className="absolute z-30 mt-14 ml-2 w-56 menu">{isAdmin&&<button className="menuitem" onClick={()=>setSettings(true)}><Settings size={16}/>Server Settings</button>}<button className="menuitem" onClick={copyInvite}><UserPlus size={16}/>Invite People</button><button className="menuitem" onClick={()=>setChannelModal(true)}><Plus size={16}/>Create Channel</button>{isAdmin&&<button className="menuitem text-red-400" onClick={async()=>{if(confirm("Delete this server?")){await fetch(`/api/servers/${server.id}`,{method:"DELETE"});location.reload()}}}><Trash2 size={16}/>Delete Server</button>}</div>}

   <div className="flex-1 overflow-y-auto p-2">
    <div className="mb-3 px-2 pt-2"><button onClick={()=>setShowSearch(true)} className="flex w-full items-center gap-2 rounded bg-[#1e1f22] px-2 py-2 text-xs text-[#949ba4]"><Search size={14}/>Search this server</button></div>
    <Section title="TEXT CHANNELS" onAdd={isMod?()=>setChannelModal(true):undefined}/>{textChannels.map(c=><ChannelRow key={c.id} c={c} active={channel?.id===c.id} onClick={()=>selectChannel(c)}/>)}
    <Section title="VOICE CHANNELS"/>{voiceChannels.map(c=><ChannelRow key={c.id} c={c} active={channel?.id===c.id} onClick={()=>{setChannel(c);setDmUser(null);setCall({kind:"AUDIO",room:c.id})}} icon={<Volume2 size={18}/>}/>)}
    <Section title="VIDEO CHANNELS"/>{videoChannels.map(c=><ChannelRow key={c.id} c={c} active={channel?.id===c.id} onClick={()=>{setChannel(c);setDmUser(null);setCall({kind:"VIDEO",room:c.id})}} icon={<Video size={18}/>}/>)}
   </div>
   <div className="bg-[#232428] p-2 flex items-center gap-2"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#5865f2] font-bold">{currentUser.username[0].toUpperCase()}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{currentUser.username}</p><p className="text-xs text-[#23a559]">Online</p></div><button onClick={()=>setSettings(true)}><Settings size={17}/></button><button onClick={logout}><LogOut size={17}/></button></div>
  </aside>

  <main className="min-w-0 flex-1 flex flex-col">
   <header className="h-14 shrink-0 flex items-center gap-2 border-b border-black/20 px-3 md:px-4">
    <button className="md:hidden" onClick={()=>setMobile(x=>!x)}><Menu/></button>
    {dmUser ? (
    <>
        <MessageCircle className="text-[#949ba4]" />
        <b>{dmUser.username}</b>
        <span className="text-xs text-[#23a559]">
        ● {dmUser.status.toLowerCase()}
        </span>
    </>
    ) : channel ? (
    <>
        {channel.type === "TEXT" ? (
        <Hash className="text-[#949ba4]" />
        ) : channel.type === "AUDIO" ? (
        <Volume2 className="text-[#949ba4]" />
        ) : (
        <Video className="text-[#949ba4]" />
        )}

        <b>{channel.name}</b>

        {channel.topic && (
        <>
            <span className="h-5 w-px bg-white/10" />
            <span className="hidden md:inline text-sm text-[#949ba4] truncate">
            {channel.topic}
            </span>
        </>
        )}
    </>
    ) : (
    <span>Select a channel</span>
    )}    
    <div className="ml-auto flex items-center gap-4 text-[#b5bac1]"><button onClick={()=>setShowMembers(x=>!x)} title="Members"><Users size={19}/></button><button onClick={()=>setShowSearch(true)} title="Search"><Search size={19}/></button><button onClick={()=>setShowNotifs(true)}><Bell size={19}/></button></div>
   </header>

   {dmUser?<DMPanel dms={dms} currentUser={currentUser} bottomRef={bottomRef}/>:channel?.type!=="TEXT"?<div className="flex-1 grid place-items-center text-center"><div><div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-[#5865f2]">{channel?.type==="AUDIO"?<Headphones size={34}/>:<Video size={34}/>}</div><h2 className="text-xl font-bold">Join {channel?.name}</h2><p className="mt-2 text-[#949ba4]">Start a {channel?.type==="AUDIO"?"voice":"video"} call with your community.</p><button className="btn mt-5 bg-[#23a559]" onClick={()=>setCall({kind:channel?.type==="AUDIO"?"AUDIO":"VIDEO",room:channel!.id})}>{channel?.type==="AUDIO"?<Headphones className="inline mr-2" size={18}/>:<Video className="inline mr-2" size={18}/>}Join call</button></div></div>:<MessagePanel messages={messages} currentUser={currentUser} editing={editing} setEditing={setEditing} editText={editText} setEditText={setEditText} saveEdit={saveEdit} deleteMessage={deleteMessage} react={react} setReply={setReply} bottomRef={bottomRef} loadMore={()=>messages[0]&&loadMessages(channel!.id,messages[0].createdAt)} typing={typing}/>
   }

   {dmUser?<form onSubmit={sendDM} className="px-4 pb-5"><Composer text={text} setText={setText} placeholder={`Message @${dmUser.username}`} onFile={()=>{}}/></form>:channel?.type==="TEXT"&&<form onSubmit={sendMessage} className="px-4 pb-5">{reply&&<div className="mb-1 flex items-center gap-2 rounded-t bg-[#2b2d31] px-3 py-2 text-xs"><Reply size={14}/>Replying to <b>{reply.member.user.username}</b><button type="button" className="ml-auto" onClick={()=>setReply(null)}><X size={14}/></button></div>}<Composer text={text} setText={setText} placeholder={`Message #${channel.name}`} onFile={()=>fileRef.current?.click()}/></form>}
   <input ref={fileRef} type="file" className="hidden" accept="image/*,.pdf,.txt,.zip" onChange={e=>{const f=e.target.files?.[0];if(f)upload(f)}}/>
  </main>

  {showMembers&&!mobile&&<aside className="hidden xl:flex w-60 shrink-0 flex-col bg-[#2b2d31] p-3 overflow-y-auto"><div className="flex items-center gap-2 mb-3"><Users size={17}/><b>Members — {server.members.length}</b></div><input className="input mb-3" placeholder="Find member..." value={memberSearch} onChange={e=>setMemberSearch(e.target.value)}/>{filteredMembers.map(m=><button key={m.id} onClick={()=>openDM(m.user)} className="flex w-full items-center gap-2 rounded px-2 py-2 text-left hover:bg-[#35373c]"><div className="relative grid h-8 w-8 place-items-center rounded-full bg-[#5865f2] font-bold">{m.user.username[0].toUpperCase()}<span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#2b2d31] ${m.user.status==="ONLINE"?"bg-[#23a559]":"bg-[#80848e]"}`}/></div><div className="min-w-0"><p className="truncate text-sm">{m.user.username}</p><p className="text-[10px] text-[#949ba4]">{m.role}</p></div></button>)}</aside>}

  {serverModal&&<Modal title="Create a server" onClose={()=>setServerModal(false)}><input className="input" value={serverName} onChange={e=>setServerName(e.target.value)} placeholder="Server name"/><button className="btn mt-4 w-full bg-[#5865f2]" onClick={createServer}>Create Server</button></Modal>}
  {channelModal&&<Modal title="Create a channel" onClose={()=>setChannelModal(false)}><input className="input" value={channelName} onChange={e=>setChannelName(e.target.value)} placeholder="channel-name"/><div className="mt-3 grid grid-cols-3 gap-2">{["TEXT","AUDIO","VIDEO"].map(t=><button key={t} className="btn bg-[#3f4147] text-xs" onClick={async()=>{const r=await fetch(`/api/servers/${server.id}/channels`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:channelName,type:t})});if(r.ok){const c=await r.json();setServer(x=>({...x,channels:[...x.channels,c]}));setChannel(c);setChannelModal(false);setChannelName("")}}}>{t}</button>)}</div></Modal>}
  {settings&&<ServerSettings server={server} isAdmin={isAdmin} onClose={()=>setSettings(false)} onSaved={(s:any)=>{setServer(s);setServers(x=>x.map(a=>a.id===s.id?s:a));setServerName(s.name)}}/>}
  {showSearch&&<SearchModal server={server} results={searchResults} query={search} setQuery={setSearch} search={doSearch} onClose={()=>setShowSearch(false)}/>}
  {call&&<CallOverlay socket={socket} currentUser={currentUser} room={call.room} kind={call.kind} onClose={()=>setCall(null)}/>}
 </div>
}

function Section({title,onAdd}:{title:string;onAdd?:()=>void}){return <div className="flex items-center px-2 pt-3 pb-1 text-[11px] font-bold text-[#949ba4]"><span>{title}</span>{onAdd&&<button className="ml-auto" onClick={onAdd}><Plus size={14}/></button>}</div>}
function ChannelRow({c,active,onClick,icon}:{c:Channel;active:boolean;onClick:()=>void;icon?:React.ReactNode}){return <button onClick={onClick} className={`flex w-full items-center gap-2 rounded px-2 py-2 text-left ${active?"bg-[#404249] text-white":"text-[#b5bac1] hover:bg-[#35373c] hover:text-white"}`}>{icon||<Hash size={18}/>}<span className="truncate">{c.name}</span></button>}
function Composer({text,setText,placeholder,onFile}:{text:string;setText:(x:string)=>void;placeholder:string;onFile:()=>void}){return <div className="flex items-center gap-2 rounded-lg bg-[#383a40] px-3 py-2"><button type="button" onClick={onFile} className="grid h-8 w-8 place-items-center rounded-full bg-[#5865f2]"><Plus size={18}/></button><input value={text} onChange={e=>setText(e.target.value)} className="flex-1 bg-transparent px-2 outline-none placeholder:text-[#949ba4]" placeholder={placeholder}/><button type="button" className="text-[#b5bac1]"><Smile size={20}/></button><button className="hidden sm:block text-xs text-[#72767d]">Enter ↵</button></div>}
function MessagePanel({messages,currentUser,editing,setEditing,editText,setEditText,saveEdit,deleteMessage,react,setReply,bottomRef,loadMore,typing}:{messages:Message[];currentUser:User;editing:string|null;setEditing:(x:string|null)=>void;editText:string;setEditText:(x:string)=>void;saveEdit:(id:string)=>void;deleteMessage:(id:string)=>void;react:(id:string,e:string)=>void;setReply:(m:Message)=>void;bottomRef:React.RefObject<HTMLDivElement>;loadMore:()=>void;typing:string}){
 return <section className="flex-1 overflow-y-auto px-3 md:px-5 py-4" onScroll={e=>{if(e.currentTarget.scrollTop<80)loadMore()}}><div className="mb-4 text-xs text-[#949ba4]">Scroll up to load older messages</div>{messages.map(m=><div key={m.id} className="group flex gap-3 rounded px-2 py-2 hover:bg-white/[.025]"><div className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#5865f2] font-bold">{m.member.user.username[0].toUpperCase()}</div><div className="min-w-0 flex-1"><div className="flex items-baseline gap-2"><b>{m.member.user.username}</b><span className="text-[10px] text-[#949ba4]">{new Date(m.createdAt).toLocaleString()}</span>{m.edited&&!m.deleted&&<span className="text-[10px] text-[#949ba4]">(edited)</span>}</div>{editing===m.id?<form onSubmit={e=>{e.preventDefault();saveEdit(m.id)}} className="mt-1 flex gap-2"><input className="input" value={editText} onChange={e=>setEditText(e.target.value)} autoFocus/><button className="btn bg-[#5865f2]">Save</button></form>:<><p className={`${m.deleted?"italic text-[#949ba4]":"text-[#dbdee1]"} break-words whitespace-pre-wrap`}>{m.content}</p>{m.attachmentUrl&&<a href={m.attachmentUrl} target="_blank" className="mt-2 block max-w-md rounded-lg bg-[#2b2d31] p-2 text-sm text-[#00a8fc]">{m.attachmentName||"Attachment"}</a>}</>}<div className="mt-1 flex flex-wrap gap-1">{groupReactions(m.reactions).map(r=><button key={r.emoji} onClick={()=>react(m.id,r.emoji)} className="rounded border border-white/10 bg-[#2b2d31] px-2 py-0.5 text-xs">{r.emoji} {r.count}</button>)}<div className="hidden group-hover:flex gap-1 rounded bg-[#1e1f22] p-1"><button title="Reply" onClick={()=>setReply(m)}><Reply size={14}/></button>{EMOJIS.slice(0,4).map(e=><button key={e} onClick={()=>react(m.id,e)}>{e}</button>)}</div></div></div>{m.member.user.id===currentUser.id&&!m.deleted&&editing!==m.id&&<div className="hidden group-hover:flex gap-1 self-start"><button onClick={()=>{setEditing(m.id);setEditText(m.content)}}><Pencil size={15}/></button><button onClick={()=>deleteMessage(m.id)}><Trash2 size={15}/></button></div>}</div>)}{typing&&<div className="px-3 py-2 text-xs text-[#949ba4]">{typing} is typing...</div>}<div ref={bottomRef}/></section>
}
function groupReactions(rs:Reaction[]){const map=new Map<string,{emoji:string,count:number}>();rs.forEach(r=>map.set(r.emoji,{emoji:r.emoji,count:(map.get(r.emoji)?.count||0)+1}));return [...map.values()]}
function Modal({title,onClose,children}:{title:string;onClose:()=>void;children:React.ReactNode}){return <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"><div className="w-full max-w-md rounded-xl bg-[#313338] p-5 shadow-2xl"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-bold">{title}</h2><button onClick={onClose}><X/></button></div>{children}</div></div>}
function ServerSettings({server,isAdmin,onClose,onSaved}:{server:Server;isAdmin:boolean;onClose:()=>void;onSaved:(s:any)=>void}){
 const [name,setName]=useState(server.name); const [members,setMembers]=useState(server.members);
 async function role(memberId:string,role:string){const r=await fetch(`/api/members/${memberId}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({role})});if(r.ok){const m=await r.json();setMembers(x=>x.map(a=>a.id===m.id?{...a,...m}:a));}}
 return <Modal title="Server Settings" onClose={onClose}>
  {isAdmin?<><label className="text-xs font-bold uppercase text-[#b5bac1]">Server name</label><input className="input mt-2" value={name} onChange={e=>setName(e.target.value)}/><button className="btn mt-4 w-full bg-[#5865f2]" onClick={async()=>{const r=await fetch(`/api/servers/${server.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({name})});if(r.ok){onSaved(await r.json())}}}>Save changes</button></>:<p className="text-[#b5bac1]">You don't have permission to edit server settings.</p>}
  <div className="mt-5"><div className="mb-2 flex items-center gap-2"><Shield size={16}/><b>Members & roles</b></div><div className="max-h-52 overflow-y-auto rounded-lg bg-[#2b2d31] p-2">{members.map(m=><div key={m.id} className="flex items-center gap-2 border-b border-white/5 py-2 last:border-0"><div className="grid h-7 w-7 place-items-center rounded-full bg-[#5865f2] text-xs font-bold">{m.user.username[0].toUpperCase()}</div><span className="min-w-0 flex-1 truncate text-sm">{m.user.username}</span>{isAdmin?<select value={m.role} onChange={e=>role(m.id,e.target.value)} className="rounded bg-[#1e1f22] px-2 py-1 text-xs"><option>ADMIN</option><option>MODERATOR</option><option>GUEST</option></select>:<span className="text-xs text-[#949ba4]">{m.role}</span>}</div>)}</div></div>
  <div className="mt-5 rounded-lg bg-[#2b2d31] p-3 text-sm text-[#b5bac1]"><p className="font-semibold text-white">Invite code</p><p className="mt-1 break-all">{server.inviteCode}</p></div>
 </Modal>
}
function SearchModal({server,results,query,setQuery,search,onClose}:{server:Server;results:any[];query:string;setQuery:(x:string)=>void;search:()=>void;onClose:()=>void}){return <Modal title="Search server" onClose={onClose}><div className="flex gap-2"><input className="input" value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&search()} placeholder="Search messages..."/><button className="btn bg-[#5865f2]" onClick={search}><Search size={18}/></button></div><div className="mt-4 max-h-80 overflow-y-auto">{results.map(x=><div key={x.id} className="border-b border-white/5 py-3"><b>{x.member.user.username}</b><p className="text-sm text-[#dbdee1]">{x.content}</p><p className="text-xs text-[#949ba4]">#{x.channel.name} · {new Date(x.createdAt).toLocaleString()}</p></div>)}</div></Modal>}
function DMPanel({dms,currentUser,bottomRef}:{dms:DM[];currentUser:User;bottomRef:React.RefObject<HTMLDivElement>}){return <section className="flex-1 overflow-y-auto px-5 py-4">{dms.length===0?<div className="h-full grid place-items-center text-[#949ba4]">Start a private conversation.</div>:dms.map(m=><div key={m.id} className={`mb-4 flex gap-3 ${m.sender.id===currentUser.id?"":"flex-row"}`}><div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#5865f2] font-bold">{m.sender.username[0].toUpperCase()}</div><div><div className="flex gap-2"><b>{m.sender.username}</b><span className="text-[10px] text-[#949ba4]">{new Date(m.createdAt).toLocaleString()}</span></div><p className="whitespace-pre-wrap text-[#dbdee1]">{m.content}</p></div></div>)}<div ref={bottomRef}/></section>}
function CallOverlay({socket,currentUser,room,kind,onClose}:{socket:Socket|null;currentUser:User;room:string;kind:"AUDIO"|"VIDEO";onClose:()=>void}){
 const [muted,setMuted]=useState(false); const [cam,setCam]=useState(kind==="VIDEO"); const [participants,setParticipants]=useState(1);
 const [started,setStarted]=useState(false); const localRef=useRef<HTMLVideoElement>(null); const remoteRef=useRef<HTMLVideoElement>(null);
 const streamRef=useRef<MediaStream|null>(null); const peers=useRef<Map<string,RTCPeerConnection>>(new Map());

 useEffect(()=>{
  if(!socket)return;
  let active=true;
  const ensureStream=async()=>{
   if(streamRef.current)return streamRef.current;
   const st=await navigator.mediaDevices.getUserMedia({audio:true,video:kind==="VIDEO"});
   if(!active){st.getTracks().forEach(t=>t.stop());return null}
   streamRef.current=st;
   if(localRef.current){localRef.current.srcObject=st;localRef.current.muted=true;await localRef.current.play().catch(()=>{});}
   setStarted(true); return st;
  };
  const makePeer=async(target:string,initiator:boolean)=>{
   const st=await ensureStream(); if(!st)return;
   let pc=peers.current.get(target);
   if(pc)return pc;
   pc=new RTCPeerConnection({iceServers:[{urls:"stun:stun.l.google.com:19302"}]});
   peers.current.set(target,pc);
   st.getTracks().forEach(t=>pc!.addTrack(t,st));
   pc.ontrack=e=>{if(remoteRef.current&&e.streams[0]){remoteRef.current.srcObject=e.streams[0];remoteRef.current.play().catch(()=>{});}};
   pc.onicecandidate=e=>{if(e.candidate)socket.emit("call-ice",{target,candidate:e.candidate});};
   pc.onconnectionstatechange=()=>{if(["failed","disconnected","closed"].includes(pc!.connectionState)){pc!.close();peers.current.delete(target);setParticipants(Math.max(1,peers.current.size+1));}};
   if(initiator){const offer=await pc.createOffer();await pc.setLocalDescription(offer);socket.emit("call-offer",{target,offer,user:{id:currentUser.id,username:currentUser.username}});}
   return pc;
  };
  const joined=async({socketId}:{socketId:string})=>{setParticipants(x=>x+1);await makePeer(socketId,true);};
  const offer=async({from,offer}:{from:string;offer:RTCSessionDescriptionInit})=>{const pc=await makePeer(from,false);if(!pc)return;await pc.setRemoteDescription(new RTCSessionDescription(offer));const answer=await pc.createAnswer();await pc.setLocalDescription(answer);socket.emit("call-answer",{target:from,answer});};
  const answer=async({from,answer}:{from:string;answer:RTCSessionDescriptionInit})=>{const pc=peers.current.get(from);if(pc)await pc.setRemoteDescription(new RTCSessionDescription(answer));};
  const ice=async({from,candidate}:{from:string;candidate:RTCIceCandidateInit})=>{const pc=peers.current.get(from);if(pc)await pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(()=>{});};
  const left=(id:string)=>{const pc=peers.current.get(id);if(pc)pc.close();peers.current.delete(id);setParticipants(Math.max(1,peers.current.size+1));};
  socket.emit("call-join",{room,user:{id:currentUser.id,username:currentUser.username}});
  socket.on("call-user-joined",joined);socket.on("call-offer",offer);socket.on("call-answer",answer);socket.on("call-ice",ice);socket.on("call-user-left",left);
  ensureStream().catch(()=>setStarted(false));
  return()=>{active=false;socket.emit("call-leave",room);socket.off("call-user-joined",joined);socket.off("call-offer",offer);socket.off("call-answer",answer);socket.off("call-ice",ice);socket.off("call-user-left",left);peers.current.forEach(p=>p.close());peers.current.clear();streamRef.current?.getTracks().forEach(t=>t.stop());streamRef.current=null;};
 },[socket,room,kind]);

 function toggleMute(){const st=streamRef.current;st?.getAudioTracks().forEach(t=>t.enabled=!t.enabled);setMuted(x=>!x)}
 function toggleCam(){const st=streamRef.current;st?.getVideoTracks().forEach(t=>t.enabled=!t.enabled);setCam(x=>!x)}
 return <div className="fixed inset-0 z-[60] grid place-items-center bg-[#111214]/95 p-5">
  <div className="w-full max-w-5xl rounded-2xl bg-[#1e1f22] p-6">
   <div className="flex items-center justify-between"><div><h2 className="text-xl font-bold">{kind==="AUDIO"?"Voice":"Video"} Call</h2><p className="text-sm text-[#949ba4]">{participants} participant{participants===1?"":"s"}</p></div><button onClick={onClose}><X/></button></div>
   <div className="mt-5 grid min-h-[400px] gap-3 rounded-xl bg-[#2b2d31] p-3 md:grid-cols-2">
    <div className="relative overflow-hidden rounded-xl bg-[#111214]">{kind==="VIDEO"?<video ref={localRef} autoPlay playsInline className="h-full min-h-[300px] w-full object-cover"/>:<div className="grid h-full min-h-[300px] place-items-center"><div className="grid h-24 w-24 place-items-center rounded-full bg-[#5865f2] text-3xl font-bold">{currentUser.username[0].toUpperCase()}</div></div>}<div className="absolute bottom-3 left-3 rounded bg-black/60 px-2 py-1 text-xs">{currentUser.username} {muted?"· muted":""}</div></div>
    <div className="relative overflow-hidden rounded-xl bg-[#111214]">{kind==="VIDEO"?<video ref={remoteRef} autoPlay playsInline className="h-full min-h-[300px] w-full object-cover"/>:<audio ref={remoteRef as any} autoPlay/>}<div className="absolute inset-0 grid place-items-center text-center text-[#949ba4] pointer-events-none">{!started&&<div><p>Camera/microphone permission is required.</p><p className="mt-1 text-xs">Allow it in the browser to join the call.</p></div>}</div></div>
   </div>
   <div className="mt-5 flex justify-center gap-3"><button className={`grid h-12 w-12 place-items-center rounded-full ${muted?"bg-white text-black":"bg-[#3f4147]"}`} onClick={toggleMute}>{muted?<MicOff/>:<Mic/>}</button>{kind==="VIDEO"&&<button className={`grid h-12 w-12 place-items-center rounded-full ${!cam?"bg-white text-black":"bg-[#3f4147]"}`} onClick={toggleCam}><VideoIcon/></button>}<button onClick={onClose} className="grid h-12 w-12 place-items-center rounded-full bg-[#f23f42]"><PhoneOff/></button></div>
  </div>
 </div>
}
