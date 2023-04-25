import mongoose from "mongoose";
import NoDataToExecuteException from "../exceptions/NoDataToExecuteException";
import Conversation from "../model/Conversation";
import ConversationMemberService from "./conversationMemberService";
import MessageService from "./messageService";
import { views } from "../config/dbViews";

class ConversationService {
  constructor() {
    this.memberService = new ConversationMemberService();
    this.messageService = new MessageService();
    this.DB = mongoose.connection;
  }

  async getConversations(req, res, next) {
    try {
      let conversations = await Conversation.find();
      return res
        .status(200)
        .send({ message: "OPERATION_SUCCESS", conversations });
    } catch (error) {
      next(error);
    }
  }

  async getConversationWithMembersAndMessages(id, res, next) {
    try {
      let conversation = await this.DB.collection(
        views.MESSAGES_PER_CONVERSATION
      ).findOne({ _id: id });

      return res.status(200).send({
        message: "OPERATION_SUCCESS",
        conversation,
      });
    } catch (error) {
      next(error);
    }
  }

  async createConversation(body, res, next) {
    try {
      const { conversationName, options, members } = body;
      if (!members || !options || !members.length)
        throw new NoDataToExecuteException();

      const createdConversation = new Conversation({
        conversationName,
        options,
      });
      const idConversation = createdConversation.id;
      const createdMembers = await this.memberService.createMembers(
        idConversation,
        members
      );

      if (!createdMembers.length === 0) throw new NoDataToExecuteException();
      await createdConversation.save();
      return res.status(200).send({
        message: "OPERATION_SUCCESS",
        conversation: createdConversation,
        members: createdMembers,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateThemaConversation(thema, res, next) {
    try {
      await Conversation.findOneAndUpdate({ id }, { options: { thema } });
      return res.status(200).send({ message: "UPDATED_THEMA" });
    } catch (error) {
      next(error);
    }
  }

  async updateEmojiConversation(emoji, res, next) {
    try {
      await Conversation.findOneAndUpdate({ id }, { options: { emoji } });
      return res.status(200).send({ message: "UPDATED_EMOJI" });
    } catch (error) {
      next(error);
    }
  }
}

export default ConversationService;
