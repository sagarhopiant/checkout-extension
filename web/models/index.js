import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
});
export const UserModel = mongoose.model("users", UserSchema);
