class UserStatusListener {
  constructor(io) {
    this.io = io;
    this.onlineUsers = [];
  }

  register = (socket) => {
    socket.on("user-online", (userId) => {
      this.#addOnlineUser(userId, socket.id);
      socket.broadcast.emit("friend-online", userId);
    });

    socket.on("disconnect", () => {
      const user = this.#removeOnlineUser(socket.id);

      if (user) socket.broadcast.emit("friend-offline", user.userId);
    });

    socket.on("user-offline", () => {
      const user = this.#removeOnlineUser(socket.id);

      if (user) this.io.emit("friend-offline", user.userId);
    });

    socket.on("get-online-friends", (friendsList) => {
      const onlineFriends = this.#getOnlineFriends(friendsList);
      socket.emit("online-friends", onlineFriends);
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
}

export default UserStatusListener;
