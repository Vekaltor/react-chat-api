import { model, Schema } from "mongoose";

const tokenEmailSchema = new Schema(
  {
    id_user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  {
    collection: "token_email",
  }
);

export default model("TokenEmail", tokenEmailSchema);
