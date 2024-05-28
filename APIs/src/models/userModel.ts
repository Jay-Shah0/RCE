// models/User.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
	username: string;
	projectIds: string[]; // Array of project IDs
}

const UserSchema: Schema = new Schema({
	username: { type: String, required: true },
	projectIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
});

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
