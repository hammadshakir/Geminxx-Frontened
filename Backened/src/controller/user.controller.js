// controller/user.controller.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { sendOTPEmail, sendCredentialsEmail, sendPasswordChangeEmail } from '../config/email.js';
import AppError from '../utils/Error.js';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRY = '7d';

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateRandomPassword = () => {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

// controller/user.controller.js - Add this helper at top

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      tokenVersion: user.tokenVersion || 0,
      role: user.role 
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

// ===== REGISTER =====
export const Register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return next(new AppError('Name, email and password are required', 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Email already registered', 409));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'viewer',
      isVerified: false,
      tokenVersion: 0,
      otp,
      otpExpiry,
      isPasswordChanged: true,
      status: 'active'
    });
    await newUser.save();

    try {
      await sendOTPEmail(newUser.email, newUser.name, otp);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'User registered. OTP sent to your email.',
      user: { 
        id: newUser._id, 
        name, 
        email, 
        role: newUser.role,
        isVerified: false 
      }
    });
  } catch (error) {
    next(error);
  }
};

// ===== VERIFY OTP =====
export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return next(new AppError('Email and OTP are required', 400));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (user.isVerified) {
      return next(new AppError('User already verified', 400));
    }

    if (user.otpExpiry < new Date()) {
      return next(new AppError('OTP has expired. Please request a new one.', 401));
    }

    if (user.otp !== otp) {
      return next(new AppError('Invalid OTP', 401));
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully. You can now log in.'
    });
  } catch (error) {
    next(error);
  }
};

// ===== RESEND OTP =====
export const resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next(new AppError('Email is required', 400));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (user.isVerified) {
      return next(new AppError('User already verified', 400));
    }

    const newOTP = generateOTP();
    const newExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = newOTP;
    user.otpExpiry = newExpiry;
    await user.save();

    await sendOTPEmail(user.email, user.name, newOTP);

    res.status(200).json({
      success: true,
      message: 'New OTP sent to your email.'
    });
  } catch (error) {
    next(error);
  }
};

// ===== LOGIN =====
// controller/user.controller.js - Login function

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log('🔑 Login attempt:', email);

    if (!email || !password) {
      return next(new AppError('Email and password required', 400));
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      return next(new AppError('Invalid credentials', 401));
    }

    if (!user.isVerified) {
      return next(new AppError('Please verify your email first', 403));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ Invalid password for:', email);
      return next(new AppError('Invalid credentials', 401));
    }

    // Update last seen
    user.lastSeen = new Date();
    user.isOnline = true;
    await user.save();

    // ✅ Generate token with correct payload
    const token = jwt.sign(
      { 
        id: user._id, 
        tokenVersion: user.tokenVersion || 0,
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    console.log('✅ Login successful:', email, 'Role:', user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPasswordChanged: user.isPasswordChanged || false,
        isOnline: user.isOnline,
        permissions: {
          canManageUsers: user.role === 'admin',
          canCreateTasks: ['admin', 'client', 'team_member'].includes(user.role),
          canEditTasks: ['admin', 'client'].includes(user.role),
          canDeleteTasks: user.role === 'admin',
          canViewAll: user.role === 'admin',
          canChat: ['admin', 'client', 'team_member'].includes(user.role),
        }
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    next(error);
  }
};

// ===== LOGOUT =====
export const logout = async (req, res, next) => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        isOnline: false,
        lastSeen: Date.now()
      });
    }
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

// ===== LOGOUT ALL =====
export const logoutAll = async (req, res, next) => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { tokenVersion: 1 },
        isOnline: false,
        lastSeen: Date.now()
      });
    }
    res.status(200).json({ success: true, message: 'Logged out from all devices' });
  } catch (error) {
    next(error);
  }
};

// ===== GET PROFILE =====
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -otp -otpExpiry')
      .populate('projects', 'title description')
      .populate('assignedClients', 'name email')
      .populate('assignedTeam', 'name email');

    res.json({
      success: true,
      user,
      permissions: {
        canCreateProjects: ['admin', 'client', 'team_member'].includes(user.role),
        canEditProjects: ['admin', 'client'].includes(user.role),
        canDeleteProjects: ['admin'].includes(user.role),
        canManageUsers: ['admin'].includes(user.role),
        canCreateTasks: ['admin', 'client', 'team_member'].includes(user.role),
        canEditTasks: ['admin', 'client'].includes(user.role),
        canDeleteTasks: ['admin'].includes(user.role),
        canViewAll: ['admin'].includes(user.role),
        canChat: ['admin', 'client', 'team_member'].includes(user.role),
        role: user.role,
        isPasswordChanged: user.isPasswordChanged || false
      }
    });
  } catch (error) {
    next(error);
  }
};

// ===== CHANGE PASSWORD =====
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return next(new AppError('Current password and new password are required', 400));
    }

    if (newPassword.length < 6) {
      return next(new AppError('New password must be at least 6 characters long', 400));
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return next(new AppError('Current password is incorrect', 401));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.isPasswordChanged = true;
    user.passwordChangedAt = new Date();
    user.tokenVersion += 1;
    await user.save();

    try {
      await sendPasswordChangeEmail(user.email, user.name);
    } catch (emailError) {
      console.error('Password change email error:', emailError);
    }

    res.json({
      success: true,
      message: 'Password changed successfully. Please login again with your new password.'
    });
  } catch (error) {
    next(error);
  }
};

// ===== ADMIN: CREATE USER =====
export const createUserByAdmin = async (req, res, next) => {
  try {
    const { name, email, role } = req.body;

    if (!req.user || req.user.role !== 'admin') {
      return next(new AppError('Only admin can create users', 403));
    }

    if (!name || !email || !role) {
      return next(new AppError('Name, email and role are required', 400));
    }

    const validRoles = ['client', 'team_member'];
    if (!validRoles.includes(role)) {
      return next(new AppError('Role must be either "client" or "team_member"', 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Email already registered', 409));
    }

    const randomPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role,
      isVerified: true,
      tokenVersion: 0,
      isPasswordChanged: false,
      status: 'active'
    });
    await newUser.save();

    try {
      await sendCredentialsEmail(email, name, randomPassword, role);
    } catch (emailError) {
      console.error('Credentials email failed:', emailError);
    }

    res.status(201).json({
      success: true,
      message: `${role} created successfully. Credentials sent to their email.`,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// ===== ADMIN: ASSIGN CLIENT TO TEAM =====
export const assignClientToTeam = async (req, res, next) => {
  try {
    const { clientId, teamMemberId } = req.body;
    
    if (!clientId || !teamMemberId) {
      return next(new AppError('Client ID and Team Member ID required', 400));
    }

    const client = await User.findById(clientId);
    const teamMember = await User.findById(teamMemberId);

    if (!client || !teamMember) {
      return next(new AppError('Client or team member not found', 404));
    }

    if (client.role !== 'client') {
      return next(new AppError('User is not a client', 400));
    }

    if (teamMember.role !== 'team_member') {
      return next(new AppError('User is not a team member', 400));
    }

    if (!client.assignedTeam.includes(teamMemberId)) {
      client.assignedTeam.push(teamMemberId);
      await client.save();
    }

    if (!teamMember.assignedClients.includes(clientId)) {
      teamMember.assignedClients.push(clientId);
      await teamMember.save();
    }

    res.json({
      success: true,
      message: 'Client assigned to team member successfully',
      client: { id: client._id, name: client.name, email: client.email },
      teamMember: { id: teamMember._id, name: teamMember.name, email: teamMember.email }
    });
  } catch (error) {
    next(error);
  }
};

// ===== ADMIN: GET ALL USERS =====
export const getAllUsers = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return next(new AppError('Only admin can view all users', 403));
    }

    const users = await User.find()
      .select('-password -otp -otpExpiry')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

// ===== ADMIN: GET USERS BY ROLE =====
export const getUsersByRole = async (req, res, next) => {
  try {
    const { role } = req.params;
    
    if (req.user.role !== 'admin') {
      return next(new AppError('Only admin can view users', 403));
    }

    const validRoles = ['admin', 'client', 'team_member', 'viewer'];
    if (!validRoles.includes(role)) {
      return next(new AppError('Invalid role', 400));
    }

    const users = await User.find({ role })
      .select('-password -otp -otpExpiry')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

// ===== ADMIN: UPDATE USER ROLE =====
export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!req.user || req.user.role !== 'admin') {
      return next(new AppError('Only admin can update roles', 403));
    }

    const validRoles = ['admin', 'client', 'team_member', 'viewer'];
    if (!validRoles.includes(role)) {
      return next(new AppError('Invalid role', 400));
    }

    const user = await User.findById(id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (user.role === 'admin' && req.user._id.toString() !== id) {
      return next(new AppError('Cannot change admin role', 403));
    }

    user.role = role;
    user.tokenVersion += 1;
    await user.save();

    res.json({
      success: true,
      message: 'User role updated successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    next(error);
  }
};

// ===== ADMIN: UPDATE USER STATUS =====
export const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!req.user || req.user.role !== 'admin') {
      return next(new AppError('Only admin can update status', 403));
    }

    const validStatus = ['active', 'inactive', 'suspended'];
    if (!validStatus.includes(status)) {
      return next(new AppError('Invalid status', 400));
    }

    const user = await User.findById(id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    user.status = status;
    await user.save();

    res.json({
      success: true,
      message: 'User status updated successfully',
      user: { id: user._id, name: user.name, status: user.status }
    });
  } catch (error) {
    next(error);
  }
};

// ===== ADMIN: DELETE USER =====
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.user || req.user.role !== 'admin') {
      return next(new AppError('Only admin can delete users', 403));
    }

    const user = await User.findById(id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (user.role === 'admin') {
      return next(new AppError('Cannot delete admin user', 403));
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ===== GOOGLE LOGIN =====
export const googleLogin = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) {
      return next(new AppError('Authorization code required', 400));
    }

    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const { access_token } = tokenResponse.data;

    const userInfoResponse = await axios.get(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: { Authorization: `Bearer ${access_token}` }
      }
    );

    const { id: googleId, email, name } = userInfoResponse.data;

    let user = await User.findOne({ $or: [{ email }, { googleId }] });
    if (!user) {
      user = new User({
        name: name || email.split('@')[0],
        email,
        googleId,
        isVerified: true,
        tokenVersion: 0,
        role: 'viewer'
      });
      await user.save();
    } else {
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
      if (!user.isVerified) {
        user.isVerified = true;
        await user.save();
      }
    }

    const token = generateToken(user);
    res.status(200).json({
      success: true,
      message: 'Google login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Google login error:', error.response?.data || error.message);
    next(new AppError('Google authentication failed', 500));
  }
};