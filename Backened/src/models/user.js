// models/user.js
import mongoose from "mongoose" 
const Schema = mongoose.Schema;

const newUser = new Schema({
  name: String,
  email: String,
  password: String,
  googleId: { type: String, unique: true, sparse: true },
  isVerified: { type: Boolean, default: false },
  tokenVersion: { type: Number, default: 0 },
  otp: { type: String },
  otpExpiry: { type: Date },
  
  // ===== RBAC Fields =====
  role: {
    type: String,
    enum: ['admin', 'client', 'team_member', 'viewer'],
    default: 'viewer'
  },
  
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  
  assignedClients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  assignedTeam: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  phone: { type: String },
  avatar: { type: String },
  position: { type: String },
  department: { type: String },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now },
  isPasswordChanged: { type: Boolean, default: false },
  
  notifications: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    sms: { type: Boolean, default: false }
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Methods
newUser.methods.canAccessProject = function(projectId) {
  if (this.role === 'admin') return true;
  return this.projects.some(id => id.toString() === projectId.toString());
};

newUser.methods.canEditProject = function(projectId) {
  if (this.role === 'admin') return true;
  if (this.role === 'client') {
    return this.projects.some(id => id.toString() === projectId.toString());
  }
  return false;
};

newUser.methods.canChatWith = function(userId) {
  if (this.role === 'admin') return true;
  if (this.role === 'client') {
    return this.assignedTeam.some(id => id.toString() === userId.toString());
  }
  if (this.role === 'team_member') {
    return this.assignedClients.some(id => id.toString() === userId.toString());
  }
  return false;
};

const User = mongoose.model("User", newUser);
export default User;