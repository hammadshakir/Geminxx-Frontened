// services/authApi.js
import api from './api';

// ============================================
// AUTH FUNCTIONS
// ============================================

// Register user with role
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/user/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

// Verify OTP
export const verifyOTP = async (data) => {
  try {
    const response = await api.post('/user/verify-otp', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'OTP verification failed');
  }
};

// Resend OTP
export const resendOTP = async (email) => {
  try {
    const response = await api.post('/user/resend-otp', { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to resend OTP');
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/user/login', { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await api.post('/user/logout');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// Logout from all devices
export const logoutAllUsers = async () => {
  try {
    await api.post('/user/logout-all');
  } catch (error) {
    console.error('Logout all error:', error);
  }
};

// Get user profile
export const getProfile = async () => {
  try {
    const response = await api.get('/user/profile');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get profile');
  }
};

// Change password
export const changePassword = async (data) => {
  try {
    const response = await api.post('/user/change-password', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to change password');
  }
};

// ============================================
// ADMIN FUNCTIONS - 🔑 Full CRUD Operations
// ============================================

// 1️⃣ GET ALL USERS
export const getAllUsers = async () => {
  try {
    const response = await api.get('/user/all');
    console.log('✅ Users fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Get users error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch users');
  }
};

// 2️⃣ GET USERS BY ROLE
export const getUsersByRole = async (role) => {
  try {
    const response = await api.get(`/user/role/${role}`);
    return response.data;
  } catch (error) {
    console.error('❌ Get users by role error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch users by role');
  }
};

// 3️⃣ CREATE USER BY ADMIN - 🔑 NEW
export const createUserByAdmin = async (userData) => {
  try {
    const response = await api.post('/user/create', userData);
    console.log('✅ User created:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Create user error:', error);
    throw new Error(error.response?.data?.message || 'Failed to create user');
  }
};

// 4️⃣ UPDATE USER ROLE - 🔑 NEW
export const updateUserRole = async (userId, role) => {
  try {
    const response = await api.put(`/user/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    console.error('❌ Update role error:', error);
    throw new Error(error.response?.data?.message || 'Failed to update role');
  }
};

// 5️⃣ UPDATE USER STATUS - 🔑 NEW
export const updateUserStatus = async (userId, status) => {
  try {
    const response = await api.put(`/user/${userId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('❌ Update status error:', error);
    throw new Error(error.response?.data?.message || 'Failed to update status');
  }
};

// 6️⃣ DELETE USER - 🔑 NEW
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Delete user error:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete user');
  }
};

// 7️⃣ ASSIGN CLIENT TO TEAM MEMBER
export const assignClientToTeam = async (data) => {
  try {
    const response = await api.post('/user/assign-client', data);
    return response.data;
  } catch (error) {
    console.error('❌ Assign client error:', error);
    throw new Error(error.response?.data?.message || 'Failed to assign client');
  }
};