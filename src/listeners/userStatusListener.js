class UserStatusListener {
  constructor(io, users, userIds) {
    this.io = io;
    this.users = users;
    this.userIds = userIds;
  }

  register = (socket) => {
    socket.on("user-online", (userId) => {
      this.#setStatus(userId, true);
      this.#setSocketId(userId, socket.id);
      console.log("zalogowal sie", userId, this.users);
      this.userIds.set(socket.id, userId);
      socket.broadcast.emit("friend-online", userId);
    });

    socket.on("user-offline", (userId) => {
      this.#setStatus(userId, false);
      this.#setSocketId(userId, "");
      console.log("wylogowal sie", userId, this.users);
      this.userIds.delete(socket.id);
      socket.broadcast.emit("friend-offline", userId);
    });

    socket.on("check-online-friends", (friendsList) => {
      const onlineFriends = this.#getOnlineFriends(friendsList);
      socket.emit("get-online-friends", onlineFriends);
    });
  };

  disconnect = (userId, socket) => {
    if (!userId) return;
    this.#setStatus(userId, false);
    this.#setSocketId(userId, "");
    console.log("wylogowal sie", userId, this.users);
    socket.broadcast.emit("friend-offline", userId);
  };

  #getOnlineFriends(friendsList) {
    return friendsList.filter(
      (idFriend) =>
        this.users.has(idFriend) && this.users.get(idFriend).isOnline
    );
  }

  #setSocketId(userId, socketId) {
    const userInfo = this.users.get(userId);
    if (userInfo) {
      userInfo.socketId = socketId;
      this.users.set(userId, userInfo);
    }
  }

  #setStatus(userId, value) {
    const userInfo = this.users.get(userId);
    if (userInfo) {
      userInfo.isOnline = value;
      this.users.set(userId, userInfo);
    }
  }
}

export default UserStatusListener;
