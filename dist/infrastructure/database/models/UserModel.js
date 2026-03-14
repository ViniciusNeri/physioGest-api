import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    verified: { type: Boolean, default: false },
    googleId: { type: String, required: false },
}, { timestamps: true });
const UserModel = mongoose.model("User", userSchema);
export default UserModel;
//# sourceMappingURL=UserModel.js.map