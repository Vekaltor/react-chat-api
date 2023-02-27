import { model, Schema } from "mongoose";

const messageSchema = new Schema(
  {
    from_id_user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    id_conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    message_text: {
      type: String,
    },
    created_at: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    collection: "messages",
  }
);

export default model("Message", messageSchema);
