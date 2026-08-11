// routes/user.routes.js
import { Router } from "express";
import * as userController from "../controller/user.controller.js";
import { auth } from "../middleware/auth.js";
import { isAdmin } from "../middleware/rbac.js";

const userRouter = Router();

// ===== PUBLIC ROUTES =====
userRouter.post("/register", userController.Register);
userRouter.post("/verify-otp", userController.verifyOTP);
userRouter.post("/resend-otp", userController.resendOTP);
userRouter.post("/login", userController.login);
userRouter.post("/google-login", userController.googleLogin);

// ===== PROTECTED ROUTES =====
userRouter.get("/profile", auth, userController.getProfile);
userRouter.post("/logout", auth, userController.logout);
userRouter.post("/logout-all", auth, userController.logoutAll);
userRouter.post("/change-password", auth, userController.changePassword);

// ===== ADMIN ROUTES =====
userRouter.get("/all", auth, isAdmin, userController.getAllUsers);
userRouter.get("/role/:role", auth, isAdmin, userController.getUsersByRole);
userRouter.post("/create", auth, isAdmin, userController.createUserByAdmin);
userRouter.put("/:id/role", auth, isAdmin, userController.updateUserRole);
userRouter.put("/:id/status", auth, isAdmin, userController.updateUserStatus);
userRouter.delete("/:id", auth, isAdmin, userController.deleteUser);
userRouter.post("/assign-client", auth, isAdmin, userController.assignClientToTeam);

export default userRouter;