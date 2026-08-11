// controller/chat.controller.js
import Conversation from '../models/conversation.js';
import Message from '../models/message.js';
import User from '../models/user.js';
import AppError from '../utils/Error.js';

// ===== GET CONVERSATIONS =====
export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id
    })
      .populate('participants', 'name email avatar isOnline lastSeen role')
      .populate('lastMessage')
      .populate({
        path: 'taskId',
        select: 'title'
      })
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      conversations
    });
  } catch (error) {
    next(error);
  }
};

// ===== GET MESSAGES =====
export const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return next(new AppError('Conversation not found', 404));
    }

    if (!conversation.participants.includes(req.user._id)) {
      return next(new AppError('You are not a participant', 403));
    }

    const messages = await Message.find({
      conversationId,
      isDeleted: false
    })
      .populate('sender', 'name email avatar isOnline role')
      .populate('recipient', 'name email avatar')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      messages
    });
  } catch (error) {
    next(error);
  }
};

// ===== GET CHAT USERS =====
export const getChatUsers = async (req, res, next) => {
  try {
    const { role, _id } = req.user;
    let query = { 
      status: 'active', 
      _id: { $ne: _id },
      isVerified: true
    };

    // Admin can chat with everyone
    if (role === 'admin') {
      // All active users except self
    }
    // Client can chat with assigned team members
    else if (role === 'client') {
      const user = await User.findById(_id).populate('assignedTeam', '_id');
      const teamIds = user.assignedTeam?.map(t => t._id) || [];
      
      if (teamIds.length === 0) {
        return res.json({ success: true, users: [] });
      }
      
      query._id = { $in: teamIds };
    }
    // Team member can chat with assigned clients
    else if (role === 'team_member') {
      const user = await User.findById(_id).populate('assignedClients', '_id');
      const clientIds = user.assignedClients?.map(c => c._id) || [];
      
      if (clientIds.length === 0) {
        return res.json({ success: true, users: [] });
      }
      
      query._id = { $in: clientIds };
    }
    // Viewer cannot chat
    else if (role === 'viewer') {
      return res.json({ success: true, users: [] });
    }

    const users = await User.find(query)
      .select('name email avatar isOnline lastSeen role')
      .sort({ name: 1 });

    res.json({
      success: true,
      users
    });
  } catch (error) {
    next(error);
  }
};

// ===== CREATE CONVERSATION =====
export const createConversation = async (req, res, next) => {
  try {
    const { userId, taskId } = req.body;

    if (!userId) {
      return next(new AppError('User ID required', 400));
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Check if user can chat
    const canChat = await checkChatPermission(req.user, userId);
    if (!canChat) {
      return next(new AppError('You are not authorized to chat with this user', 403));
    }

    // Check if conversation exists
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, userId] },
      taskId: taskId || null
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [req.user._id, userId],
        taskId: taskId || null,
        isGroup: false
      });
      await conversation.save();
    }

    await conversation.populate('participants', 'name email avatar isOnline role');

    res.json({
      success: true,
      conversation
    });
  } catch (error) {
    next(error);
  }
};

// ===== HELPER: CHECK CHAT PERMISSION =====
async function checkChatPermission(user1, userId2) {
  try {
    const user2 = await User.findById(userId2);
    if (!user2) return false;

    // Admin can chat with everyone
    if (user1.role === 'admin' || user2.role === 'admin') return true;

    // Client can chat with assigned team
    if (user1.role === 'client') {
      await user1.populate('assignedTeam');
      return user1.assignedTeam?.some(id => id._id.toString() === userId2.toString());
    }

    // Team member can chat with assigned clients
    if (user1.role === 'team_member') {
      await user1.populate('assignedClients');
      return user1.assignedClients?.some(id => id._id.toString() === userId2.toString());
    }

    return false;
  } catch (error) {
    console.error('Check chat permission error:', error);
    return false;
  }
}