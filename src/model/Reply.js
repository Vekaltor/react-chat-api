import { model, Schema } from "mongoose";

const replySchema = new Schema(
  {
    id_parent_comment: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Comment",
    },
    id_user_replied: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    text: {
      type: String,
    },
    created_at: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    collection: "replies",
  }
);

export default model("Reply", replySchema);
