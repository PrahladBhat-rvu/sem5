# Discord Clone — Final Local Edition

A feature-rich Discord-style team/community chat application inspired by the CodeWithAntonio tutorial.

## Features

- Local username authentication
- Multiple servers
- Server creation, deletion and rename
- Unique invite links
- Text, audio and video channels
- Real-time Socket.io messaging
- Message edit/delete
- Infinite-style older-message loading
- Replies
- Emoji reactions
- File/image/PDF uploads (10 MB local limit)
- Server message search
- Member list + member search
- Roles: Admin / Moderator / Guest
- Direct messages
- Notifications
- Online/offline presence
- Typing indicator
- Light/dark mode
- Responsive mobile layout
- Voice/video call room signaling UI
- Prisma + SQLite
- No Clerk/UploadThing/LiveKit account required for local use

## Setup

Node 18+ recommended.

### Windows

```powershell
copy .env.example .env
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Open http://localhost:3000

### Important

This local edition intentionally replaces paid/external tutorial services with local equivalents so the project works immediately.

The original tutorial ecosystem uses Clerk authentication, UploadThing for attachments, LiveKit for calls and a hosted SQL database. This version keeps those features self-contained where practical.

For production, replace local auth, SQLite and local uploads with real authentication, PostgreSQL/MySQL and object storage.

## Reset database

Stop the server, delete `prisma/dev.db`, then:

```powershell
npx prisma db push
```
