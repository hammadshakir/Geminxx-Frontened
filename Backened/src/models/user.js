import mongoose from "mongoose" 
const Schema = mongoose.Schema;

const newUser = new Schema({
  name: String,
  email: String,
  password: String,
  googleId: { type: String, unique: true, sparse: true },
  isVerified: { type: Boolean, default: false },
  tokenVersion: { type: Number, default: 0 },
  otp: { type: String },          // 6-digit OTP
  otpExpiry: { type: Date }       // OTP expiry time
});

const User = mongoose.model("User", newUser);
export default User;