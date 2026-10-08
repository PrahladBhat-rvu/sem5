const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const port = Number(process.env.PORT || 3000);
const app = next({ dev, hostname: "localhost", port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => handle(req, res));
  const io = new Server(httpServer, {
    path: "/api/socket",
    cors: { origin: "*", methods: ["GET", "POST"] }
  });

  io.on("connection", (socket) => {
    socket.on("join-channel", id => socket.join(`channel:${id}`));
    socket.on("leave-channel", id => socket.leave(`channel:${id}`));
    socket.on("join-server", id => socket.join(`server:${id}`));
    socket.on("typing", data => socket.to(`channel:${data.channelId}`).emit("typing", data));
    socket.on("presence", data => socket.broadcast.emit("presence", data));

    socket.on("call-join", ({ room, user }) => {
      socket.join(`call:${room}`);
      socket.to(`call:${room}`).emit("call-user-joined", { socketId: socket.id, user });
    });
    socket.on("call-offer", ({ target, offer, user }) => io.to(target).emit("call-offer", { from: socket.id, offer, user }));
    socket.on("call-answer", ({ target, answer }) => io.to(target).emit("call-answer", { from: socket.id, answer }));
    socket.on("call-ice", ({ target, candidate }) => io.to(target).emit("call-ice", { from: socket.id, candidate }));
    socket.on("call-leave", room => {
      socket.leave(`call:${room}`);
      socket.to(`call:${room}`).emit("call-user-left", socket.id);
    });
  });

  global.io = io;
  httpServer.listen(port, () => console.log(`> Discord clone running at http://localhost:${port}`));
});