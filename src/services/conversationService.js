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

  async getConversationWithMembersAndMessages(id, res, next) {
    try {
      let conversation = await this.DB.collection(
        views.MESSAGES_PER_CONVERSATION
      )
        .findOne({ id_conversation: mongoose.Types.ObjectId(id) })
        .then((data) => data)
        .catch((err) => {
          throw new Error(err);
        });

      return res.status(200).send({
        message: "OPERATION_SUCCESS",
        conversation: conversation,
      });
    } catch (error) {
      next(error);
    }
  }

  async getIdsAndMembersPrivateConversations(idUser, res, next) {
    try {
      let conversations = await this.DB.collection(
        views.MESSAGES_PER_CONVERSATION
      )
        .find({
          type: "private",
          $and: [
            {
              "members.id_user": {
                $in: [mongoose.Types.ObjectId(idUser)],
              },
            },
            { members: { $size: 2 } },
          ],
        })
        .toArray()
        .then((data) =>
          data.map(({ id_conversation, members }) => {
            return {
              id_conversation,
              members: members.map(({ id_user }) => id_user),
            };
          })
        )
        .catch((err) => {
          throw new Error(err);
        });

      return res.status(200).send({
        message: "OPERATION_SUCCESS",
        conversations,
      });
    } catch (error) {
      next(error);
    }
  }

  async createConversation(body, res, next) {
    try {
      const members = body;
      if (!members || !members.length) throw new NoDataToExecuteException();

      const createdConversation = new Conversation({
        type: members.length > 2 ? "group" : "private",
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
        idConversation,
      });
    } catch (error) {
      next(error);
    }
  }

  async setThemaConversation(thema, res, next) {
    try {
      await Conversation.findOneAndUpdate({ id }, { options: { thema } });
      return res.status(200).send({ message: "UPDATED_THEMA" });
    } catch (error) {
      next(error);
    }
  }

  async setEmojiConversation(emoji, res, next) {
    try {
      await Conversation.findOneAndUpdate({ id }, { options: { emoji } });
      return res.status(200).send({ message: "UPDATED_EMOJI" });
    } catch (error) {
      next(error);
    }
  }
}

export default ConversationService;
