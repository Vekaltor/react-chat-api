import { model, Schema } from "mongoose";

const friendShipSchema = new Schema(
  {
    id_user_request: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    id_user_accept: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    is_accepted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "friendships",
  }
);

export default model("Friendship", friendShipSchema);
