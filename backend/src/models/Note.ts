import mongoose, { Schema, Document, Types } from "mongoose";

export interface INote extends Document {
  user: Types.ObjectId;
  title: string;
}

const noteSchema = new Schema<INote>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true }
  },
  { timestamps: true }
);

export const Note = mongoose.model<INote>("Note", noteSchema);
