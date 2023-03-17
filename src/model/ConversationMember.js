import { model, Schema } from "mongoose";

const conversationMemberSchema = new Schema(
  {
    id_conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    id_user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    joined_date_time: {
      type: Date,
    },
    left_date_time: {
      type: Date,
    },
    nick_name: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "member"],
    },
  },
  {
    collection: "conversation_members",
  }
);

export default model("ConversationMember", conversationMemberSchema);
