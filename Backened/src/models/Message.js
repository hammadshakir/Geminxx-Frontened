// models/message.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isGroupChat: {
    type: Boolean,
    default: false
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file', 'system', 'notification'],
    default: 'text'
  },
  content: {
    type: String,
    required: true
  },
  attachments: [{
    name: String,
    url: String,
    size: Number,
    type: String
  }],
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    emoji: String
  }],
  isDeleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Message = mongoose.model("Message", messageSchema);
export default Message;