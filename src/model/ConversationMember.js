import { model, Schema } from "mongoose";

const conversationMemberSchema = new Schema(
  {
    id_conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
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
    collection: "conversation_member",
  }
);

export default model("ConversationMember", conversationMemberSchema);
