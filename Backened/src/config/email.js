// config/email.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send OTP
export const sendOTPEmail = async (email, name, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Email - Gemnixx',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; border-radius: 10px;">
          <div style="text-align: center; padding: 20px 0;">
            <h1 style="color: #4f46e5; font-size: 28px;">Gemnixx</h1>
            <p style="color: #6b7280; font-size: 16px;">Project Management</p>
          </div>
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Welcome ${name}! 👋</h2>
            <p style="color: #4b5563; line-height: 1.6;">Thank you for registering with Gemnixx. Please verify your email address by entering the OTP below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <div style="display: inline-block; background: #f3f4f6; padding: 15px 30px; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4f46e5;">
                ${otp}
              </div>
            </div>
            <p style="color: #6b7280; font-size: 14px;">This OTP is valid for 10 minutes.</p>
            <p style="color: #6b7280; font-size: 14px;">If you didn't create an account, please ignore this email.</p>
          </div>
          <div style="text-align: center; padding: 20px 0; color: #9ca3af; font-size: 12px;">
            <p>© 2024 Gemnixx. All rights reserved.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${email}`);
  } catch (error) {
    console.error('❌ Email sending error:', error);
    throw error;
  }
};

// Send Credentials (Password)
export const sendCredentialsEmail = async (email, name, password, role) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Welcome to Gemnixx - Your ${role} Account Credentials`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; border-radius: 10px;">
          <div style="text-align: center; padding: 20px 0;">
            <h1 style="color: #4f46e5; font-size: 28px;">Gemnixx</h1>
            <p style="color: #6b7280; font-size: 16px;">Project Management</p>
          </div>
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Welcome to the Team! 🎉</h2>
            <p style="color: #4b5563; line-height: 1.6;">Hello <strong>${name}</strong>,</p>
            <p style="color: #4b5563; line-height: 1.6;">You have been added as a <strong style="color: #4f46e5; text-transform: capitalize;">${role}</strong> to Gemnixx.</p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-bottom: 15px;">Your Login Credentials:</h3>
              <p style="margin: 8px 0;"><strong style="color: #4b5563;">Email:</strong> <span style="color: #4f46e5;">${email}</span></p>
              <p style="margin: 8px 0;"><strong style="color: #4b5563;">Password:</strong> <span style="color: #4f46e5; font-family: monospace; font-size: 18px; letter-spacing: 2px;">${password}</span></p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/login" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                Login to Your Account
              </a>
            </div>
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-top: 20px;">
              <p style="color: #92400e; font-size: 14px; margin: 0;">
                ⚠️ <strong>Important:</strong> Please change your password after your first login for security reasons.
              </p>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">If you didn't request this, please contact your administrator.</p>
          </div>
          <div style="text-align: center; padding: 20px 0; color: #9ca3af; font-size: 12px;">
            <p>© 2024 Gemnixx. All rights reserved.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Credentials email sent to ${email}`);
  } catch (error) {
    console.error('❌ Credentials email error:', error);
    throw error;
  }
};

// Send password change confirmation
export const sendPasswordChangeEmail = async (email, name) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Changed Successfully - Gemnixx',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; border-radius: 10px;">
          <div style="text-align: center; padding: 20px 0;">
            <h1 style="color: #4f46e5; font-size: 28px;">Gemnixx</h1>
          </div>
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937;">Password Changed 🔒</h2>
            <p style="color: #4b5563; line-height: 1.6;">Hello <strong>${name}</strong>,</p>
            <p style="color: #4b5563; line-height: 1.6;">Your password has been successfully changed.</p>
            <div style="background: #dbeafe; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-top: 20px;">
              <p style="color: #1e40af; font-size: 14px; margin: 0;">
                ✅ If you made this change, no further action is required.
              </p>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">If you didn't change your password, please contact support immediately.</p>
          </div>
          <div style="text-align: center; padding: 20px 0; color: #9ca3af; font-size: 12px;">
            <p>© 2024 Gemnixx. All rights reserved.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Password change confirmation sent to ${email}`);
  } catch (error) {
    console.error('❌ Password change email error:', error);
  }
};