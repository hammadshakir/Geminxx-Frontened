// server.js
import "./src/config/dns.js";
import app from "./src/app.js";
import ConnectDB from "./src/config/database.js";
import { createServer } from 'http';
import { setupWebSocket } from './src/websocket.js';
import dotenv from 'dotenv';

// Import models to register
import './src/models/user.js';
import './src/models/message.js';
import './src/models/conversation.js';
import './src/models/task.js';
import './src/models/project.js';

dotenv.config();

async function startServer() {
  try {
    // Connect to Database
    await ConnectDB();

    // Create HTTP server
    const server = createServer(app);

    // Setup WebSocket
    try {
      setupWebSocket(server);
      console.log("🔌 WebSocket server ready for real-time chat");
    } catch (wsError) {
      console.log("⚠️ WebSocket setup skipped:", wsError.message);
    }

    // Start server
    server.listen(1000, () => {
      console.log("🚀 Server is running on port 1000");
      console.log("📡 API: http://localhost:1000/api");
      console.log("🔌 WebSocket: ws://localhost:1000");
      console.log("💡 WebSocket path: /socket.io");
    });

  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}

startServer();