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
  getIdPrivateConversation = (req, res, next) => {
    let { ids } = req.query;
    tryCatch(this.conversationService.getIdByIdsFriendAndUser(ids, res, next));
  };
}

export default new ConversationController();
