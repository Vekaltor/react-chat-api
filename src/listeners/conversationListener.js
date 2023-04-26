import MessageService from "../services/messageService";

class ConversationListener {
  constructor(io) {
    this.io = io;
    this.messageService = new MessageService();
    this.conversations = {};
    this.timeIntervals = {
      saveMessage: 10000,
    };
  }

  register = (socket) => {
    socket.on("join-to-conversation", ({ conversationId, userId }) => {
      if (!this.conversations[conversationId])
        this.#createConversationRoom(conversationId);

      if (this.#isUserInCoversationRoom(conversationId, userId))
        this.#addUserToConversationRoom(conversationId, userId, socket);

      socket.join(conversationId);
    });

    socket.on("leave-from-conversation", (conversationId) => {
      const conversation = this.conversations[conversationId];

      if (conversation && conversation.messages.length > 0)
        this.saveMessages(conversationId);
    });

    socket.on("send-new-message", ({ message, conversationId }) => {
      if (!message || !conversationId) return;

      const { interval } = this.conversations[conversationId];

      if (!interval) this.setIntervalSaveMessagesByConversation(conversationId);
      this.#addMessageToQueue(conversationId, message);

      socket.to(conversationId).emit("get-new-message", message);
    });
  };

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
        await this.messageService.addNewMessage(message, conversationId);
      });

      conversation.messages = [];
    }
  }
}

export default ConversationListener;
