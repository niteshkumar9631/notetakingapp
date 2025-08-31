import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  dob: string;
  email: string;
  otpHash?: string | null;
  otpExpires?: Date | null;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    dob: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    otpHash: { type: String, default: null },
    otpExpires: { type: Date, default: null }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
