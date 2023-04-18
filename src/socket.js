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
    socket.on("user-online", (userId) => {
      this.#addUser(userId, socket.id);
      socket.broadcast.emit("friend-online", userId);
    });

    socket.on("disconnect", () => {
      const user = this.#removeUser(socket.id);

      if (user) {
        socket.broadcast.emit("friend-offline", user.userId);
      }
    });

    socket.on("user-offline", () => {
      const user = this.#removeUser(socket.id);

      if (user) {
        this.io.emit("friend-offline", user.userId);
      }
    });

    socket.on("get-online-friends", (friendsList) => {
      const onlineFriends = this.#getOnlineFriends(friendsList);
      socket.emit("online-friends", onlineFriends);
    });
  };

  #getOnlineFriends(friendsList) {
    return this.users
      .filter(({ userId }) => friendsList.includes(userId))
      .map((onlineFriend) => onlineFriend.userId);
  }

  #addUser(userId, socketId) {
    if (!this.users.some((user) => user.userId === userId))
      this.users.push({ userId, socketId });
  }

  #removeUser(socketId) {
    const user = this.users.find((user) => user.socketId === socketId);
    if (!user) return;

    this.users = this.users.filter((user) => user.socketId !== socketId);
    return user;
  }
}
