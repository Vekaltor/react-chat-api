import { Server } from "socket.io";
import corsOptions from "./config/cors.config";

export class ServerSocket {
  instance;
  io;
  users;
  conversations;

  constructor(server) {
    this.instance = this;
    this.users = [];
    this.onlineUsers = [];
    this.io = new Server(server, {
      serveClient: false,
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false,
      cors: corsOptions,
    });

    this.io.on("connect", this.StartListeners);
  }

  StartListeners = (socket) => {
    socket.on("login", (userId) => {
      this.#addUser(userId, socket.id);
      this.io.emit("get-users", this.users);
    });

    socket.on("disconnect", () => {
      this.#removeUser(socket.id);
      this.io.emit("get-users", this.users);
    });

    socket.on("logout", () => {
      this.#removeUser(socket.id);
      this.io.emit("get-users", this.users);
    });
  };

  #addUser(userId, socketId) {
    if (!this.users.some((user) => user.userId === userId))
      this.users.push({ userId, socketId });
  }

  #removeUser(socketId) {
    this.users = this.users.filter((user) => user.socketId !== socketId);
  }
}
