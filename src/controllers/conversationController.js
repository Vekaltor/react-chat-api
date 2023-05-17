import ConversationService from "../services/conversationService";
import tryCatch from "../utils/tryCatch";

class ConversationController {
  constructor() {
    this.conversationService = new ConversationService();
  }

  createConversation = (req, res, next) => {
    let body = req.body;
    tryCatch(this.conversationService.createConversation(body, res, next));
  };

  getConversationWithMembersAndMessages = (req, res, next) => {
    let idConversation = req.query.id;
    tryCatch(
      this.conversationService.getConversationWithMembersAndMessages(
        idConversation,
        res,
        next
      )
    );
  };

  getIdsAndMembersPrivateConversations = (req, res, next) => {
    let { idUser } = req.query;
    tryCatch(
      this.conversationService.getIdsAndMembersPrivateConversations(
        idUser,
        res,
        next
      )
    );
  };
}

export default new ConversationController();
