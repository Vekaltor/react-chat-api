import { model, Schema } from "mongoose";

const likeSchema = new Schema(
  {
    id_liked_on: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: ["Comment" | "Reply", "Post"],
    },
    id_liked_by_user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    reaction_type: {
      type: String,
    },
  },
  {
    collection: "likes",
  }
);

export default model("Like", likeSchema);
