// models/comment.js
import mongoose from "mongoose"
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  review: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  created_At: {
    type: Date,
    default: Date.now
  },
  user: {
    type: String,
    default: "Anonymous"
  },
  avatar: {
    type: String,
    default: "👤"
  },
  likes: {
    type: Number,
    default: 0
  },
  liked: {
    type: Boolean,
    default: false
  }
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;