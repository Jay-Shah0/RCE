import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
	name: string;
	description: string;
	ownerId: string; // Reference to the User model
}

const ProjectSchema: Schema = new Schema({
	name: { type: String, required: true },
	description: { type: String, required: true },
	ownerId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
});

const Project = mongoose.model<IProject>("Project", ProjectSchema);
export default Project;
