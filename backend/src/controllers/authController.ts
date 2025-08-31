import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOtpMail } from "../utils/mailer";

const OTP_TTL = Number(process.env.OTP_TTL_MINUTES || 5) * 60 * 1000;

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const hashOtp = async (otp: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(otp, salt);
};

const signToken = (payload: { id: string; email: string }) =>
  jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "1d" });

/** Signup → send OTP */
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, dob, email } = req.body;
    if (!name || !dob || !email) return res.status(400).json({ message: "name, dob, email required" });

    let user = await User.findOne({ email });
    if (!user) user = new User({ name, dob, email });

    const otp = generateOtp();
    user.otpHash = await hashOtp(otp);
    user.otpExpires = new Date(Date.now() + OTP_TTL);
    await user.save();

    await sendOtpMail(email, otp);
    return res.json({ message: "OTP sent to your email" });
  } catch (e) {
    return res.status(500).json({ message: "Signup OTP error", error: (e as Error).message });
  }
};

/** Verify OTP for signup */
export const verifySignupOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.otpHash || !user.otpExpires) return res.status(400).json({ message: "No OTP issued" });
    if (user.otpExpires.getTime() < Date.now()) return res.status(400).json({ message: "OTP expired" });

    const ok = await bcrypt.compare(otp, user.otpHash);
    if (!ok) return res.status(400).json({ message: "Invalid OTP" });

    user.otpHash = null;
    user.otpExpires = null;
    await user.save();

    const token = signToken({ id: user.id, email: user.email });
    return res.json({ message: "Verified", token, user: { name: user.name, email: user.email } });
  } catch (e) {
    return res.status(500).json({ message: "Verify error", error: (e as Error).message });
  }
};

/** Login → send OTP (existing user only) */
export const loginSendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "No account with this email" });

    const otp = generateOtp();
    user.otpHash = await hashOtp(otp);
    user.otpExpires = new Date(Date.now() + OTP_TTL);
    await user.save();

    await sendOtpMail(email, otp);
    return res.json({ message: "Login OTP sent" });
  } catch (e) {
    return res.status(500).json({ message: "Login OTP error", error: (e as Error).message });
  }
};

/** Verify login OTP */
export const verifyLoginOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.otpHash || !user.otpExpires) return res.status(400).json({ message: "No OTP issued" });
    if (user.otpExpires.getTime() < Date.now()) return res.status(400).json({ message: "OTP expired" });

    const ok = await bcrypt.compare(otp, user.otpHash);
    if (!ok) return res.status(400).json({ message: "Invalid OTP" });

    user.otpHash = null;
    user.otpExpires = null;
    await user.save();

    const token = signToken({ id: user.id, email: user.email });
    return res.json({ message: "Logged in", token, user: { name: user.name, email: user.email } });
  } catch (e) {
    return res.status(500).json({ message: "Verify login error", error: (e as Error).message });
  }
};
