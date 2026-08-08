import express from "express";
const router = express.Router();

import Comment from "../models/comment.js"
import AppError from "../utils/Error.js";
import Project from "../models/project.js"

export async function ShowComments (req, res, next){
  const { projectId } = req.params;
  const project = await Project.findById(projectId).populate('Comment');
  
  if (!project) {
    return next(new AppError("Project not found", 404));
  }
  
  // Sort comments by created_At descending (newest first)
  const comments = project.Comment.sort((a, b) => b.created_At - a.created_At);
  
  res.json(comments);
}

export async function AddComment(req, res, next){
  const { projectId } = req.params;
  const { text, rating, user, avatar } = req.body;
  
  console.log("📝 Adding comment to project:", projectId);
  console.log("📝 Comment data:", req.body);
  
  const project = await Project.findById(projectId);
  if (!project) {
    return next(new AppError("Project not found", 404));
  }
  
  // Create new comment with proper data
  const newComment = new Comment({
    review: text || "No review text",
    rating: rating || 0,
    created_At: new Date(),
    user: user || "Anonymous",
    avatar: avatar || "👤",
    likes: 0,
    liked: false
  });
  
  await newComment.save();
  console.log("✅ Comment saved:", newComment);
  
  // Add comment reference to project
  project.Comment.push(newComment._id);
  await project.save();
  
  // Get populated comment
  const populatedComment = await Comment.findById(newComment._id);
  
  res.status(201).json({
    success: true,
    message: "Comment added successfully",
    comment: populatedComment
  });
}
// 

export async function UpdateComment(req, res, next){
  const { id } = req.params;
  const { text } = req.body;
  
  console.log("✏️ Updating comment:", id);
  console.log("✏️ New text:", text);
  
  if (!text) {
    return next(new AppError("Comment text is required", 400));
  }
  
  const comment = await Comment.findByIdAndUpdate(
    id,
    { review: text },
    { new: true, runValidators: true }
  );
  
  if (!comment) {
    return next(new AppError("Comment not found", 404));
  }
  
  console.log("✅ Comment updated:", comment);
  
  res.json({
    success: true,
    message: "Comment updated successfully",
    comment: comment
  });
}

export async function DeleteComment(req, res, next){
  const { id } = req.params;
  
  console.log("🗑️ Deleting comment:", id);
  
  const comment = await Comment.findByIdAndDelete(id);
  if (!comment) {
    return next(new AppError("Comment not found", 404));
  }
  
  // Remove comment reference from project
  await Project.updateOne(
    { Comment: id },
    { $pull: { Comment: id } }
  );
  
  console.log("✅ Comment deleted");
  
  res.json({
    success: true,
    message: "Comment deleted successfully",
    comment: comment
  });
}

  export async function LikeComment (req, res, next){
  const { id } = req.params;
  
  console.log("❤️ Liking comment:", id);
  
  const comment = await Comment.findById(id);
  if (!comment) {
    return next(new AppError("Comment not found", 404));
  }
  
  comment.likes = (comment.likes || 0) + 1;
  comment.liked = !comment.liked;
  await comment.save();
  
  console.log("✅ Comment liked:", comment.likes);
  
  res.json({
    success: true,
    message: "Comment liked successfully",
    likes: comment.likes,
    liked: comment.liked
  });
}

 export async function UnlikeComment(req, res, next){
  const { id } = req.params;
  
  const comment = await Comment.findById(id);
  if (!comment) {
    return next(new AppError("Comment not found", 404));
  }
  
  if (comment.likes > 0) {
    comment.likes = comment.likes - 1;
    comment.liked = false;
    await comment.save();
  }
  
  res.json({
    success: true,
    message: "Comment unliked successfully",
    likes: comment.likes,
    liked: comment.liked
  });
}
