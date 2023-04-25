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

  addNewMessage = async (data) => {
    const { from_id_user, created_at, id_conversation, message_text } = data;
    console.log(data);
    try {
      const newMessage = await this.Model.create({
        created_at,
        from_id_user,
        id_conversation,
        message_text,
      });

      newMessage.save();
    } catch (error) {
      throw new Error(error);
    }
  };
}

export default MessageService;
