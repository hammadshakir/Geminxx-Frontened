// services/taskApi.js
import api from './api';

// Get all tasks (based on role)
export const getTasks = async () => {
  try {
    const response = await api.get('/tasks');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch tasks');
  }
};

// Get single task
export const getTask = async (taskId) => {
  try {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch task');
  }
};

// Create task (Client/Admin only)
export const createTask = async (taskData) => {
  try {
    const response = await api.post('/tasks', taskData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create task');
  }
};

// Update task
export const updateTask = async (taskId, taskData) => {
  try {
    const response = await api.put(`/tasks/${taskId}`, taskData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update task');
  }
};

// Delete task (Admin only)
export const deleteTask = async (taskId) => {
  try {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete task');
  }
};