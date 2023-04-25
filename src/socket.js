import { Server } from "socket.io";
import corsOptions from "./config/cors.config";
import MessageService from "./services/messageService";

export class ServerSocket {
  constructor(server) {
    this.instance = this;
    this.onlineUsers = [];
    this.conversations = {};
    this.messageService = new MessageService();
    this.io = new Server(server, {
      serveClient: false,
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false,
      cors: corsOptions,
    });

    this.timeIntervals = {
      saveMessage: 10000,
    };

    this.io.on("connect", this.StartListeners);
  }

  StartListeners = (socket) => {
    socket.on("user-online", (userId) => {
      this.#addOnlineUser(userId, socket.id);
      socket.broadcast.emit("friend-online", userId);
    });

    socket.on("disconnect", () => {
      const user = this.#removeOnlineUser(socket.id);

      if (user) {
        socket.broadcast.emit("friend-offline", user.userId);
      }
    });

    socket.on("user-offline", () => {
      const user = this.#removeOnlineUser(socket.id);

      if (user) {
        this.io.emit("friend-offline", user.userId);
      }
    });

    socket.on("get-online-friends", (friendsList) => {
      const onlineFriends = this.#getOnlineFriends(friendsList);
      socket.emit("online-friends", onlineFriends);
    });

    socket.on("join-to-conversation", ({ conversationId, userId }) => {
      if (!this.conversations[conversationId])
        this.#createConversationRoom(conversationId);

      if (this.#isUserInCoversationRoom(conversationId, userId))
        this.#addUserToConversationRoom(conversationId, userId, socket);

      socket.join(conversationId);
    });

    socket.on("leave-from-conversation", (conversationId) => {
      if (
        this.conversations[conversationId] &&
        this.conversations[conversationId].messages.length > 0
      ) {
        this.saveMessages(conversationId);
      }
    });

    socket.on("send-new-message", ({ message, conversationId }) => {
      if (!message || !conversationId) return;
      console.log(this.conversations[conversationId]);
      console.log(message, conversationId);
      if (!this.conversations[conversationId].interval) {
        this.setIntervalSaveMessagesByConversation(conversationId);
      }
      this.#addMessageToQueue(conversationId, message);

      socket.to(conversationId).emit("get-new-message", message);
    });
  };

  #getOnlineFriends(friendsList) {
    return this.onlineUsers
      .filter(({ userId }) => friendsList.includes(userId))
      .map((onlineFriend) => onlineFriend.userId);
  }

  #addOnlineUser(userId, socketId) {
    if (!this.onlineUsers.some((user) => user.userId === userId))
      this.onlineUsers.push({ userId, socketId });
  }

  #removeOnlineUser(socketId) {
    const user = this.onlineUsers.find((user) => user.socketId === socketId);
    if (!user) return;

    this.onlineUsers = this.onlineUsers.filter(
      (user) => user.socketId !== socketId
    );
    return user;
  }

  #createConversationRoom(conversationId) {
    this.conversations[conversationId] = {
      users: [],
      messages: [],
      interval: null,
    };
  }

  deleteConversationRoom(conversationId) {
    const conversation = this.conversations[conversationId];
    if (conversation) {
      clearInterval(conversation.interval);
      delete this.conversations[conversationId];
    }
  }

  #addUserToConversationRoom(conversationId, userId) {
    this.conversations[conversationId].users.push(userId);
  }

  deleteUserFromConversationRoom(conversationId, userId) {
    if (this.#isUserInCoversationRoom(conversationId, userId)) {
      const members = this.conversations[conversationId].users;
      const indexToRemove = members.find(userId);
      members.users.splice(indexToRemove, 1);
    }
  }

  #isUserInCoversationRoom(conversationId, userId) {
    if (!this.conversations[conversationId]) return;

    return this.conversations[conversationId].users.find(
      (idUser) => idUser === userId
    );
  }

  #addMessageToQueue(conversationId, message) {
    this.conversations[conversationId].messages.push(message);
  }

  setIntervalSaveMessagesByConversation(conversationId) {
    const conversation = this.conversations[conversationId];
    let interval = conversation.interval;

    if (!conversation) return;

    if (!interval) {
      this.conversations[conversationId].interval = setInterval(() => {
        this.counter++;
        console.log("Counter interval: " + this.counter);
        console.log(this.conversations[conversationId].messages);

        this.saveMessages(conversationId);
      }, this.timeIntervals.saveMessage);
    }
  }

  counter = 0;

  saveMessages(conversationId) {
    const conversation = this.conversations[conversationId];
    const messages = conversation.messages;

    if (messages.length === 0) {
      console.log("Clear interval");

      clearInterval(conversation.interval);
      conversation.interval = null;
    } else {
      messages.forEach(async (message) => {
        await this.messageService.addNewMessage(message);
      });

      conversation.messages = [];
    }
  }
}
