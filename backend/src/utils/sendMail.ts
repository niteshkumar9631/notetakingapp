import nodemailer from "nodemailer";

export const sendOtpMail = async (to: string, otp: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();
    console.log("✅ SMTP Server is ready to send emails");

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}`,
    });

    console.log(`📧 OTP sent to ${to}`);
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    throw new Error("Email not sent");
  }
};
