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
    details: {
      role: {
        type: String,
        enum: ["normal", "admin"],
        default: "normal",
      },
      is_verified: {
        type: Boolean,
        default: false,
      },
      created_at: {
        type: Date,
        default: Date.now(),
      },
      profile_photo: {
        type: String,
      },
      sex: {
        type: String,
        enum: "male" | "female" | "unknown",
      },
      date_birth: {
        type: Date,
      },
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
