import { Server } from "socket.io";
import corsOptions from "./config/cors.config";
import ConversationListener from "./listeners/conversationListener";
import UserStatusListener from "./listeners/userStatusListener";

export class ServerSocket {
  constructor(server) {
    this.io = new Server(server, {
      serveClient: false,
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false,
      cors: corsOptions,
    });
    this.users = new Map();
    this.userIds = new Map();

    this.userStatusListener = new UserStatusListener(
      this.io,
      this.users,
      this.userIds
    );
    this.conversationListener = new ConversationListener(
      this.io,
      this.users,
      this.userIds
    );

    this.io.on("connect", this.#startListeners);
  }

  #startListeners = (socket) => {
    this.#userConnected(socket);
    this.conversationListener.register(socket);
    this.userStatusListener.register(socket);
    this.#socketDisconnected(socket);
  };

  #userConnected = (socket) => {
    socket.on("user-connected", (userId) => {
      this.#initializeUserFunctionality(userId);
    });
  };

  #socketDisconnected = (socket) => {
    socket.on("disconnect", () => {
      console.log("socket Disconnected");
      const userId = this.#getUserIdBySocketId(socket.id);

      this.conversationListener.disconnect(userId, socket);
      this.userStatusListener.disconnect(userId, socket);
      this.userIds.delete(socket.id);
    });
  };

  #initUser = (userId) => {
    if (!this.users.has(userId))
      this.users.set(userId, {
        isOnline: true,
        unreadConversations: new Set(),
        conversationIds: new Set(),
      });
  };

  #initializeUserFunctionality = (userId) => {
    this.#initUser(userId);
  };

  #getUserIdBySocketId(socketId) {
    return this.userIds.get(socketId);
  }
}
