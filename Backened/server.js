// server.js
import "./src/config/dns.js";
import app from "./src/app.js";
import ConnectDB from "./src/config/database.js";
import { createServer } from 'http';
import { setupWebSocket } from './src/websocket.js';
import dotenv from 'dotenv';

// ✅ Import all models to register them
import './src/models/user.js';
import './src/models/message.js';
import './src/models/conversation.js';
import './src/models/task.js';      // ✅ Add this
import './src/models/project.js';

dotenv.config();

async function startServer() {
  try {
    console.log('🚀 Starting server...');
    
    await ConnectDB();
    const server = createServer(app);
    
    try {
      setupWebSocket(server);
      console.log("🔌 WebSocket server ready for real-time chat");
    } catch (wsError) {
      console.log("⚠️ WebSocket setup skipped:", wsError.message);
    }

    const PORT = process.env.PORT || 1000;
    server.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📡 API: http://localhost:${PORT}/api`);
      console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
      console.log(`💡 WebSocket path: /socket.io`);
    });

  } catch (error) {
    console.error(" Server starting up failed:", error);
    console.log("changes made");  
    process.exit(1);
  }
}

startServer();