// models/task.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'review', 'completed', 'rejected'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  history: [{
    field: String,
    oldValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    changedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    attachments: [String],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  dueDate: Date,
  startDate: Date,
  completedDate: Date,
  attachments: [{
    name: String,
    url: String,
    size: Number,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [String],
  clientFeedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    givenAt: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

taskSchema.methods.addHistory = function(field, oldValue, newValue, userId) {
  this.history.push({
    field,
    oldValue,
    newValue,
    changedBy: userId
  });
};

taskSchema.methods.canEdit = function(userId, userRole) {
  if (userRole === 'admin') return true;
  if (userRole === 'client' && this.createdBy.toString() === userId.toString()) {
    return true;
  }
  if (userRole === 'team_member') {
    return this.assignedTo.some(id => id.toString() === userId.toString());
  }
  return false;
};

const Task = mongoose.model("Task", taskSchema);
export default Task;