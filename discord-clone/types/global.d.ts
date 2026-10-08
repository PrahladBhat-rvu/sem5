import type { Server as IOServer } from "socket.io";
declare global { var io: IOServer | undefined; }
export {};