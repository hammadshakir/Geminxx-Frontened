import { Router } from "express";
import * as userController from "../controller/user.controller.js";

const userRouter = Router();

userRouter.post("/register", userController.Register);
userRouter.post("/verify-otp", userController.verifyOTP);        // <-- OTP verification
userRouter.post("/resend-otp", userController.resendOTP);        // optional
userRouter.post("/login", userController.login);
userRouter.get("/logout", userController.logout);
userRouter.get("/logout-form-all", userController.logoutAll);

// Google OAuth (if needed)
// userRouter.get("/google/callback", userController.googleCallback); // comment out if not implemented
userRouter.post("/google-login", userController.googleLogin);

export default userRouter;