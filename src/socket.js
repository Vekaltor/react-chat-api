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
    this.userStatusListener = new UserStatusListener(this.io);
    this.conversationListener = new ConversationListener(this.io);

    this.io.on("connect", this.#startListeners);
  }

  #startListeners = (socket) => {
    this.conversationListener.register(socket);
    this.userStatusListener.register(socket);

    this.#socketDisconnected(socket);
  };

  #socketDisconnected = (socket) => {
    socket.on("disconnect", () => {
      // console.log("XD");
    });
  };
}
