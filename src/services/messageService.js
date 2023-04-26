import Message from "../model/Message";

class MessageService {
  constructor() {
    this.Model = Message;
  }

  getMessagesByConversation = async (idConversation) => {
    try {
      return await this.Model.find({ id_conversation: idConversation });
    } catch (error) {
      throw new Error(error);
    }
  };

  addNewMessage = async (messageData, idConversation) => {
    const { from_id_user, created_at, message_text } = messageData;

    try {
      const newMessage = await this.Model.create({
        created_at,
        from_id_user,
        id_conversation: idConversation,
        message_text,
      });
      console.log(newMessage);
      newMessage.save();
    } catch (error) {
      throw new Error(error);
    }
  };
}

export default MessageService;
