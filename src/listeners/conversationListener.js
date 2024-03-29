import MessageService from "../services/messageService";

class ConversationListener {
  constructor(io, users, userIds) {
    this.io = io;
    this.messageService = new MessageService();
    this.conversations = new Map();
    this.users = users;
    this.userIds = userIds;
  }

  register = (socket) => {
    socket.on("join-to-conversation", ({ conversationId, userId }) => {
      if (!conversationId) return;

      if (!this.#isExistsRoom(conversationId)) {
        this.#createConversationRoom(conversationId);
      }

      let conversation = this.conversations.get(conversationId);

      if (!this.#isUserInCoversationRoom(conversation, userId)) {
        this.#addUserToConversationRoom(conversation, userId);
      }

      this.#changeUserStatus(conversation, userId, true);
      this.users.get(userId).unreadConversations.delete(conversationId);
      this.users.get(userId).conversationIds.add(conversationId);
      socket.join(conversationId);
      console.log("Polaczyl sie ", userId, "do", conversation);
    });

    socket.on("leave-from-conversation", ({ conversationId, userId }) => {
      const conversation = this.conversations.get(conversationId);
      if (!conversation) return;

      this.#changeUserStatus(conversation, userId, false);
      console.log("Opuszczono: ", conversationId, conversation);
      socket.leave();
    });

    socket.on("send-new-message", ({ message, conversationId }) => {
      if (!message || !conversationId) return;
      console.log("Aktywnosc na: ", conversationId);

      this.saveMessage(message, conversationId);
      this.#broadcastNotficationToUnactiveMembers(conversationId, message);

      socket
        .to(conversationId)
        .emit("get-new-message", { message, conversationId });
    });

    socket.on("check-unread-conversations", (userId) => {
      this.#emitAllUnreadConversations(socket.id, userId);
    });
  };

  disconnect = (disconnectedUserId) => {
    if (!disconnectedUserId) return;
    const { conversationIds } = this.users.get(disconnectedUserId);

    conversationIds.forEach((conversationId) => {
      const conversation = this.conversations.get(conversationId);

      conversation.users.forEach((user) => {
        if (user.isActive && user.userId === disconnectedUserId) {
          user.isActive = false;
        }
      });
    });
  };

  #broadcastNotficationToUnactiveMembers(conversationId, message) {
    const unactiveMembers = this.conversations
      .get(conversationId)
      .users.filter((user) => user.isActive === false);

    unactiveMembers.forEach(({ userId }) => {
      const socketId = this.users.get(userId).socketId;
      const currentUnreadMessages = this.users.get(userId).unreadConversations.get(conversationId) || [];
      this.users.get(userId).unreadConversations.set(conversationId,[...currentUnreadMessages, message]);
      if (socketId){
          const unreadConversation = {
              conversationId,
              unreadMessages: this.users.get(userId).unreadConversations.get(conversationId)
          }
          this.#emitUnreadConversation(socketId, userId, unreadConversation);
      }
    });
    console.log("unactiveMembers: ", unactiveMembers);
    console.log("conversation: ", this.conversations.get(conversationId));
  }

  #emitUnreadConversation(socketId, userId, unreadConversation) {
    if (!this.users.has(userId)) return;
    this.io.to(socketId).emit("get-unread-conversations", unreadConversation);
  }

  #emitAllUnreadConversations(socketId, userId) {
    if (!this.users.has(userId)) return;
    const unreadConversationsMap = this.users.get(userId).unreadConversations;
    const unreadConversationsArray= [];

    unreadConversationsMap.forEach((unreadMessages, conversationId) => {
      unreadConversationsArray.push({
        conversationId,
        unreadMessages
      });
    });

    this.io.to(socketId).emit("get-all-unread-conversations", unreadConversationsArray);
  }

  #createConversationRoom(conversationId) {
    this.conversations.set(conversationId, {
      users: [],
      messages: [],
    });
  }

  #isExistsRoom(conversationId) {
    return this.conversations.get(conversationId);
  }

  deleteConversationRoom(conversationId) {
    const conversation = this.conversations.get(conversationId);

    if (conversation) {
      this.conversations.delete(conversationId);
    }
  }

  #addUserToConversationRoom(conversation, userId) {
    console.log("Dodawanie usera ", userId, "do roomu ", conversation);
    conversation.users.push({
      userId,
      isActive: false,
    });
  }

  #isUserInCoversationRoom(conversation, userId) {
    return conversation.users.find((user) => user.userId === userId);
  }

  deleteUserFromConversationRoom(conversationId, userId) {
    const conversation = this.conversations.get(conversationId);
    if (conversation) return;

    if (this.#isUserInCoversationRoom(conversation, userId)) {
      const { users } = conversation;
      const indexToRemove = users.findIndex((user) => user.userId === userId);
      members.splice(indexToRemove, 1);
    }
  }

  #changeUserStatus(conversation, userId, value) {
    const { users } = conversation;
    let currentUser = users.find((user) => user.userId === userId);

    if (!currentUser) return;
    currentUser.isActive = value;
  }

  async saveMessage(message, conversationId) {
    await this.messageService.addNewMessage(message, conversationId);
  }
}

export default ConversationListener;
