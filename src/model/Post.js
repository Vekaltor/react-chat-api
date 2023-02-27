import { model, Schema } from "mongoose";

const postSchema = new Schema(
  {
    id_user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
    },
    written_text: {
      type: String,
    },
    media: {
      type: String,
    },
    likes: {
      type: Number,
    },
    created_at: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    collection: "posts",
  }
);

export default model("Post", postSchema);
