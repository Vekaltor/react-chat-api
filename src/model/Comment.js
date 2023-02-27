import { model, Schema } from "mongoose";

const friendSchema = new Schema(
  {
    id_user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    id_post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
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
    collection: "friends",
  }
);

export default model("Friend", friendSchema``);
