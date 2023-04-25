import { model, Schema } from "mongoose";

const type = {
  PRIVATE: "private",
  GROUP: "group",
};

const conversationSchema = new Schema(
  {
    conversationName: {
      type: String,
    },
    options: {
      thema: {
        type: String,
      },
      emoji: {
        type: String,
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
