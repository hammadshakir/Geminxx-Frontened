// config/database.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const ConnectDB = async () => {
  try {
    console.log('📡 Connecting to MongoDB...');

    // ✅ Connection options for better debugging
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
    };

    // Get MongoDB URI
    let mongoURI = process.env.MONGO_URI;
    
    // If no URI in .env, use local
    if (!mongoURI) {
      mongoURI = 'mongodb://localhost:27017/gemnixx';
      console.log('⚠️ Using default local MongoDB URI');
    }
    
    console.log(`🔗 Connecting to: ${mongoURI.replace(/\/\/.*@/, '//*****@')}`);

    // ✅ Connect with options
    const conn = await mongoose.connect(mongoURI, options);
    
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`🔗 Host: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔌 Port: ${conn.connection.port}`);
    console.log(`📦 Models: ${Object.keys(conn.models).join(', ')}`);
    
    // ✅ Connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully');
    });

    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error:`, error.message);
    console.log('\n💡 Troubleshooting Tips:');
    console.log('1. Make sure MongoDB is installed and running');
    console.log('2. Check if MongoDB service is started');
    console.log('3. Verify MongoDB URI in .env file');
    console.log('4. Try using MongoDB Atlas instead of local');
    console.log('\n🔧 Commands:');
    console.log('  - Windows: net start MongoDB');
    console.log('  - Mac: brew services start mongodb-community');
    console.log('  - Linux: sudo systemctl start mongod');
    
    process.exit(1);
  }
};

export default ConnectDB;