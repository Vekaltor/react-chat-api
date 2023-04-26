import { model, Schema } from "mongoose";

const type = {
  PRIVATE: "private",
  GROUP: "group",
};

const conversationSchema = new Schema(
  {
    conversation_name: {
      type: String,
      default: "",
    },
    options: {
      thema: {
        type: String,
        default: "",
      },
      emoji: {
        type: String,
        default: "",
      },
    },
    type: {
      type: String,
      enum: [type.GROUP, type.PRIVATE],
      default: type.PRIVATE,
    },
  },
  {
    collection: "conversations",
  }
);

export default model("Conversation", conversationSchema);
