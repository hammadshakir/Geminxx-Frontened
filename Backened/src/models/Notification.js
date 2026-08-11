// models/notification.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: [
      'task_created',
      'task_updated',
      'task_completed',
      'task_assigned',
      'task_review',
      'new_message',
      'new_comment',
      'mention',
      'project_invite',
      'system_alert'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  link: {
    type: String
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId
  },
  entityType: {
    type: String,
    enum: ['task', 'project', 'message', 'user']
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;