import Conversation from "../model/Conversation";

class SocketsConversation {
  constructor() {
    this.collection = new Conversation().collection();
  }

  startConversation(socket) {}

  sendMessage(socket) {
    console.log(this.collection);
    socket.emit("");
  }
}

export default SocketsConversation;
