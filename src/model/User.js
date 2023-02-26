import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    pass: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    role: {
      type: String,
      enum: ["normal", "admin"],
      default: "normal",
    },
    created: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    collection: "users",
  }
);

export default model("User", userSchema);
