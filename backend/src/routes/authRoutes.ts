import { Router } from "express";
import { signup, verifySignupOtp, loginSendOtp, verifyLoginOtp } from "../controllers/authController";

const router = Router();

// Signup OTP
router.post("/signup", signup);
router.post("/verify-signup-otp", verifySignupOtp);

// Login OTP
router.post("/login/send-otp", loginSendOtp);
router.post("/login/verify-otp", verifyLoginOtp);

export default router;
