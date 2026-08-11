// routes/chat.routes.js
import { Router } from 'express';
import * as chatController from '../controller/chat.controller.js';
import { auth } from '../middleware/auth.js';
import { isTeamMember } from '../middleware/rbac.js';

const chatRouter = Router();

chatRouter.use(auth);

// Get all conversations for user
chatRouter.get('/conversations', chatController.getConversations);

// Get messages for a conversation
chatRouter.get('/conversations/:conversationId/messages', chatController.getMessages);

// Get users for chat (who user can chat with)
chatRouter.get('/users', chatController.getChatUsers);

// Create or get conversation with a user
chatRouter.post('/conversations', chatController.createConversation);

export default chatRouter;