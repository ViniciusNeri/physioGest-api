import mongoose from "mongoose";
import type { User } from "../../../domain/entities/User.js";

const userSchema = new mongoose.Schema<User>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    verified: { type: Boolean, default: false },
    googleId: { type: String, required: false },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<User>("User", userSchema);

export default UserModel;
