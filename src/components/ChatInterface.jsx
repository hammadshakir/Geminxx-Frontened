// components/ChatInterface.jsx
import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

export default function ChatInterface({ conversationId, recipientId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { user, token } = useAuth();

  useEffect(() => {
    // Connect to WebSocket
    const newSocket = io(import.meta.env.VITE_WS_URL || 'http://localhost:5000', {
      auth: { token }
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      if (conversationId) {
        newSocket.emit('join_conversation', conversationId);
      }
    });

    newSocket.on('new_message', (message) => {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    });

    newSocket.on('user_typing', (data) => {
      // Show typing indicator
    });

    return () => {
      if (conversationId) {
        newSocket.emit('leave_conversation', conversationId);
      }
      newSocket.disconnect();
    };
  }, [conversationId, token]);

  // Fetch messages
  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
    }
  }, [conversationId]);

  const fetchMessages = async (convId) => {
    try {
      const response = await fetch(`/api/chat/conversations/${convId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setMessages(data);
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    socket.emit('send_message', {
      conversationId,
      recipientId,
      content: newMessage
    });

    setNewMessage('');
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!typing) {
      setTyping(true);
      socket.emit('typing', { conversationId, isTyping: true });
    }

    clearTimeout(window.typingTimeout);
    window.typingTimeout = setTimeout(() => {
      setTyping(false);
      socket.emit('typing', { conversationId, isTyping: false });
    }, 1000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Chat</h3>
        <p className="text-sm text-gray-500">
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${msg.sender._id === user.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-xl ${
                msg.sender._id === user.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
        <div className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}