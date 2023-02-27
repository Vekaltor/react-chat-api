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
    pass: {
      type: String,
      required: true,
    },
    refresh_token: {
      type: String,
    },
    role: {
      type: String,
      enum: ["normal", "admin"],
      default: "normal",
    },
    created_at: {
      type: Date,
      default: Date.now(),
    },
    profile_photo: {
      type: String,
    },
    contact: {
      primary_email: {
        type: String,
        unique: true,
        required: true,
      },
      secondary_email: {
        type: String,
      },
      country: {
        type: String,
      },
      city: {
        type: String,
      },
      phone: {
        type: String,
      },
    },
  },
  {
    collection: "users",
  }
);

export default model("User", userSchema);
