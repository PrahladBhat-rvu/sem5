# React Bootstrap Two-Port Client + Server

A simple full-stack web app with:
- Client: React + Vite + React-Bootstrap on port 5173
- Server: Node.js + Express on port 5000
- The client calls `http://localhost:5000/api/message`

## Requirements
- Node.js 18+ recommended
- npm

## Run

### Terminal 1 - Server
```bash
cd server
npm install
npm run dev
```

Server:
http://localhost:5000

### Terminal 2 - Client
```bash
cd client
npm install
npm run dev
```

Client:
http://localhost:5173

Open the client URL in your browser.

## What the app demonstrates

Click **Test Server Connection**. The React client sends a GET request to the Express server and displays the JSON response.

The two applications intentionally use different ports:
- Frontend: 5173
- Backend: 5000
