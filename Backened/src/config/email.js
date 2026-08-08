import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (userEmail, userName, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Your OTP for Email Verification',
    html: `
      <h1>Hello ${userName}!</h1>
      <p>Your OTP for email verification is:</p>
      <h2 style="background: #f4f4f4; padding: 15px; font-size: 32px; letter-spacing: 5px; display: inline-block;">${otp}</h2>
      <p>This OTP is valid for <strong>10 minutes</strong>.</p>
      <p>If you did not request this, please ignore this email.</p>
    `,
  };
  await transporter.sendMail(mailOptions);
};

// (Optional) You can keep old sendVerificationEmail if needed, but we'll use OTP now.