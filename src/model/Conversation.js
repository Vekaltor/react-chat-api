import { model, Schema } from "mongoose";

const conversationSchema = new Schema(
  {
    conversationName: {
      type: String,
    },
  },
  {
    collection: "conversations",
  }
);

export default model("Conversation", conversationSchema);
