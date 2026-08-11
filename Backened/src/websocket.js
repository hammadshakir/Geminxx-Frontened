// src/websocket.js
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from './models/user.js';
import Message from './models/message.js';
import Conversation from './models/conversation.js';

export const setupWebSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    },
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    allowEIO3: true,
  });

  // ===== AUTHENTICATION MIDDLEWARE =====
  io.use(async (socket, next) => {
    try {
      // Get token from auth or headers
      const token = socket.handshake.auth.token || 
                    socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        console.log('❌ No token provided');
        return next(new Error('Authentication required'));
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Get user
      const user = await User.findById(decoded.id)
        .select('-password -otp -otpExpiry')
        .populate('assignedClients', '_id')
        .populate('assignedTeam', '_id');
      
      if (!user) {
        console.log('❌ User not found');
        return next(new Error('User not found'));
      }

      if (user.status === 'suspended') {
        console.log('❌ Account suspended');
        return next(new Error('Account suspended'));
      }

      socket.user = user;
      console.log(`✅ Auth success: ${user.name} (${user.role})`);
      next();
    } catch (error) {
      console.error('❌ Socket auth error:', error.message);
      next(new Error('Invalid token'));
    }
  });

  // ===== CONNECTION HANDLER =====
  io.on('connection', (socket) => {
    const user = socket.user;
    console.log(`✅ User connected: ${user.name} (${user.role}) [${socket.id}]`);

    // ===== JOIN PERSONAL ROOM =====
    socket.join(`user_${user._id}`);
    console.log(`📌 Joined personal room: user_${user._id}`);

    // ===== UPDATE ONLINE STATUS =====
    User.findByIdAndUpdate(user._id, {
      isOnline: true,
      lastSeen: new Date()
    })
      .then(() => {
        // Broadcast to all users
        io.emit('user_online', {
          userId: user._id,
          name: user.name,
          role: user.role
        });
        console.log(`🟢 ${user.name} is online`);
      })
      .catch(err => console.error('Update status error:', err));

    // ===== JOIN CONVERSATION =====
    socket.on('join_conversation', async (conversationId) => {
      try {
        console.log(`📂 ${user.name} joining conversation: ${conversationId}`);
        
        const conversation = await Conversation.findById(conversationId)
          .populate('participants', 'name email avatar isOnline role');
        
        if (!conversation) {
          socket.emit('error', { message: 'Conversation not found' });
          return;
        }

        // Check if user is participant
        const isParticipant = conversation.participants.some(
          p => p._id.toString() === user._id.toString()
        );
        
        if (!isParticipant) {
          socket.emit('error', { message: 'You are not a participant' });
          return;
        }

        socket.join(`conversation_${conversationId}`);
        socket.emit('joined_conversation', { 
          conversationId,
          conversation 
        });
        
        console.log(`✅ ${user.name} joined conversation ${conversationId}`);
      } catch (error) {
        console.error('Join conversation error:', error);
        socket.emit('error', { message: 'Failed to join conversation' });
      }
    });

    // ===== LEAVE CONVERSATION =====
    socket.on('leave_conversation', (conversationId) => {
      socket.leave(`conversation_${conversationId}`);
      console.log(`📤 ${user.name} left conversation ${conversationId}`);
    });

    // ===== SEND MESSAGE =====
    socket.on('send_message', async (data) => {
      try {
        const { conversationId, recipientId, content, taskId } = data;
        console.log(`📤 ${user.name} sending message:`, { 
          conversationId, 
          recipientId, 
          content: content?.substring(0, 30) + '...' 
        });

        if (!content || content.trim() === '') {
          socket.emit('error', { message: 'Message content is required' });
          return;
        }

        // Check chat permission (if recipient provided)
        if (recipientId) {
          const canChat = await checkChatPermission(user, recipientId);
          if (!canChat) {
            socket.emit('error', { message: 'You are not authorized to chat with this user' });
            return;
          }
        }

        // Find or create conversation
        let conversation;
        if (conversationId) {
          conversation = await Conversation.findById(conversationId);
          if (!conversation) {
            socket.emit('error', { message: 'Conversation not found' });
            return;
          }
        } else if (recipientId) {
          // Find existing conversation
          conversation = await Conversation.findOne({
            participants: { $all: [user._id, recipientId] },
            taskId: taskId || null
          });

          // Create new if not exists
          if (!conversation) {
            conversation = new Conversation({
              participants: [user._id, recipientId],
              taskId: taskId || null,
              isGroup: false
            });
            await conversation.save();
            console.log(`📂 New conversation created: ${conversation._id}`);
          }
        } else {
          socket.emit('error', { message: 'Conversation ID or recipient ID required' });
          return;
        }

        // Create message
        const message = new Message({
          conversationId: conversation._id,
          sender: user._id,
          recipient: recipientId || null,
          content: content.trim(),
          messageType: 'text',
          taskId: taskId || null
        });

        await message.save();
        console.log(`💬 Message saved: ${message._id}`);

        // Update conversation
        conversation.lastMessage = message._id;
        conversation.updatedAt = new Date();
        await conversation.save();

        // Populate sender and recipient
        await message.populate('sender', 'name email avatar isOnline role');
        await message.populate('recipient', 'name email avatar role');

        // Prepare message for sending
        const messageData = {
          _id: message._id,
          content: message.content,
          conversationId: message.conversationId,
          sender: message.sender,
          recipient: message.recipient,
          messageType: message.messageType,
          createdAt: message.createdAt,
          taskId: message.taskId
        };

        // ===== EMIT TO CONVERSATION ROOM =====
        io.to(`conversation_${conversation._id}`).emit('new_message', messageData);
        console.log(`📨 Message sent to conversation ${conversation._id}`);

        // ===== NOTIFY RECIPIENT (if online) =====
        if (recipientId) {
          io.to(`user_${recipientId}`).emit('new_message_notification', {
            conversationId: conversation._id,
            message: messageData,
            from: user.name
          });
          console.log(`🔔 Notification sent to user ${recipientId}`);
        }

        // ===== CONFIRM TO SENDER =====
        socket.emit('message_sent', {
          success: true,
          message: messageData
        });

      } catch (error) {
        console.error('❌ Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // ===== TYPING INDICATOR =====
    socket.on('typing', (data) => {
      const { conversationId, isTyping } = data;
      socket.to(`conversation_${conversationId}`).emit('user_typing', {
        userId: user._id,
        name: user.name,
        isTyping
      });
    });

    // ===== MARK MESSAGES AS READ =====
    socket.on('mark_read', async (data) => {
      try {
        const { conversationId, messageIds } = data;
        
        await Message.updateMany(
          {
            _id: { $in: messageIds },
            'readBy.user': { $ne: user._id }
          },
          {
            $push: {
              readBy: {
                user: user._id,
                readAt: new Date()
              }
            }
          }
        );

        socket.to(`conversation_${conversationId}`).emit('messages_read', {
          userId: user._id,
          messageIds
        });
      } catch (error) {
        console.error('Mark read error:', error);
      }
    });

    // ===== DISCONNECT =====
    socket.on('disconnect', async () => {
      console.log(`❌ User disconnected: ${user.name} [${socket.id}]`);

      // Update user status
      try {
        await User.findByIdAndUpdate(user._id, {
          isOnline: false,
          lastSeen: new Date()
        });

        // Broadcast offline status
        io.emit('user_offline', {
          userId: user._id,
          name: user.name
        });
        console.log(`🔴 ${user.name} is offline`);
      } catch (error) {
        console.error('Disconnect error:', error);
      }
    });

    // ===== ERROR HANDLER =====
    socket.on('error', (error) => {
      console.error(`Socket error for ${user.name}:`, error);
    });
  });

  // ===== IO ERROR HANDLER =====
  io.engine.on('connection_error', (err) => {
    console.log('❌ Connection error:', err);
  });

  return io;
};

// ===== HELPER: CHECK CHAT PERMISSION =====
async function checkChatPermission(user1, userId2) {
  try {
    // Get user2
    const user2 = await User.findById(userId2);
    if (!user2) {
      console.log('❌ User2 not found');
      return false;
    }

    console.log(`🔍 Checking chat permission: ${user1.name} (${user1.role}) -> ${user2.name} (${user2.role})`);

    // === ADMIN CHAT WITH EVERYONE ===
    if (user1.role === 'admin' || user2.role === 'admin') {
      console.log('✅ Admin chat allowed');
      return true;
    }

    // === CLIENT CHAT WITH ASSIGNED TEAM ===
    if (user1.role === 'client') {
      // Populate assignedTeam if not already
      if (!user1.populated('assignedTeam')) {
        await user1.populate('assignedTeam');
      }
      const canChat = user1.assignedTeam?.some(
        team => team._id.toString() === userId2.toString()
      );
      console.log(`✅ Client chat with team: ${canChat}`);
      return canChat;
    }

    // === TEAM MEMBER CHAT WITH ASSIGNED CLIENTS ===
    if (user1.role === 'team_member') {
      // Populate assignedClients if not already
      if (!user1.populated('assignedClients')) {
        await user1.populate('assignedClients');
      }
      const canChat = user1.assignedClients?.some(
        client => client._id.toString() === userId2.toString()
      );
      console.log(`✅ Team member chat with client: ${canChat}`);
      return canChat;
    }

    console.log('❌ No chat permission found');
    return false;
  } catch (error) {
    console.error('Check chat permission error:', error);
    return false;
  }
}