import ConversationService from "../services/conversationService";
import tryCatch from "../utils/tryCatch";

class ConversationController {
  constructor() {
    this.conversationService = new ConversationService();
  }

  getConversations = (req, res, next) => {
    tryCatch(this.conversationService.getConversations(req, res, next));
  };

  createConversation = (req, res, next) => {
    let body = req.body;
    tryCatch(this.conversationService.createConversation(body, res, next));
  };

  getConversationWithMembers = (req, res, next) => {
    let idConversation = req.params.id;
    tryCatch(
      this.conversationService.getConversationWithMembers(
        idConversation,
        res,
        next
      )
    );
  };
}

export default new ConversationController();
