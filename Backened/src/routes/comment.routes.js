import { Router } from "express";
import * as commentController from "../controller/comment.controller.js";

const commentRouter = Router();

// 6. GET all comments for a project
commentRouter.get("/projects/:projectId/comments", commentController.ShowComments);

//7. add new comment
commentRouter.post("/projects/:projectId/comments", commentController.AddComment);

// 8. UPDATE a comment - FIXED
commentRouter.put("/comments/:id", commentController.UpdateComment);

// 9. DELETE a comment - FIXED
commentRouter.delete("/comments/:id", commentController.DeleteComment);

// 10. LIKE a comment - FIXED
commentRouter.post("/comments/:id/like", commentController.LikeComment);

// 10. UNLIKE a comment - FIXED
commentRouter.post("/comments/:id/unlike", commentController.UnlikeComment);

export default commentRouter;
