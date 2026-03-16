import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    id: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    verified: { type: Boolean, default: false },
    googleId: { type: String, required: false },
}, { timestamps: true });
userSchema.pre('save', function () {
    if (!this.id) {
        this.id = this._id.toString();
    }
});
const UserModel = mongoose.model("User", userSchema);
export default UserModel;
//# sourceMappingURL=UserModel.js.map