// pages/Chat.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { io } from 'socket.io-client';
import {
  FiMessageSquare,
  FiSend,
  FiUsers,
  FiSearch,
  FiUser,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiMoreVertical,
  FiPhone,
  FiVideo,
  FiInfo,
  FiUserPlus,
  FiLogOut,
  FiMoon,
  FiSun,
  FiSmile,
  FiPaperclip,
  FiImage,
  FiFile,
  FiMic,
  FiPlus,
  FiX,
  FiSettings,
  FiBell,
  FiStar,
  FiArchive,
  FiTrash2,
  FiAtSign,
  FiHash,
  FiLink,
  FiCode,
  FiBold,
  FiItalic,
  FiUnderline,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiList,
  FiMenu,
  FiChevronDown,
  FiChevronUp,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckSquare,
  FiSquare,
  FiMinus,
  FiMaximize,
  FiMinimize,
} from 'react-icons/fi';
import { FaRocket } from 'react-icons/fa';

// Socket connection
let socket = null;

export default function Chat() {
  const { user, token } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserList, setShowUserList] = useState(false);
  const [showConversationList, setShowConversationList] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socketError, setSocketError] = useState(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const socketRef = useRef(null);

  // 🔒 Check if user can chat
  const canChat = user?.role !== 'viewer' && user?.role !== undefined;

  // Initialize socket
  useEffect(() => {
    if (!token || !canChat) {
      setInitialLoading(false);
      return;
    }

    console.log('🔌 Connecting to WebSocket...');
    console.log('🔑 Token:', token?.substring(0, 20) + '...');
    
    // ✅ Use correct port 1000 (backend port)
    const SOCKET_URL = 'http://localhost:1000';
    
    // Connect to WebSocket
    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Socket connected successfully!');
      setIsConnected(true);
      setSocketError(null);
      // Fetch conversations after connection
      fetchConversations();
      fetchChatUsers();
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      setSocketError('Failed to connect to chat server. Please refresh.');
      setIsConnected(false);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
      setSocketError(error.message || 'Chat error occurred');
    });

    socket.on('new_message', (message) => {
      console.log('📩 New message received:', message);
      setMessages(prev => [...prev, message]);
      scrollToBottom();
      fetchConversations();
    });

    socket.on('user_typing', (data) => {
      setTypingUsers(prev => {
        const filtered = prev.filter(u => u.userId !== data.userId);
        if (data.isTyping) {
          return [...filtered, data];
        }
        return filtered;
      });
    });

    socket.on('user_online', (data) => {
      console.log('👤 User online:', data);
      setOnlineUsers(prev => [...prev, data.userId]);
    });

    socket.on('user_offline', (data) => {
      console.log('👤 User offline:', data);
      setOnlineUsers(prev => prev.filter(id => id !== data.userId));
    });

    socket.on('new_message_notification', ({ conversationId, message }) => {
      console.log('🔔 New message notification:', message);
      fetchConversations();
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
      setSocketError(error.message || 'Chat error occurred');
    });

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [token, canChat]);

  // Join conversation when selected
  useEffect(() => {
    if (currentConversation && socket && isConnected) {
      console.log('📂 Joining conversation:', currentConversation._id);
      socket.emit('join_conversation', currentConversation._id);
      fetchMessages(currentConversation._id);
    }
  }, [currentConversation, isConnected]);

  // Scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // ===== FETCH CONVERSATIONS =====
  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await fetch('http://localhost:1000/api/chat/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch conversations');
      }
      
      const data = await response.json();
      console.log('📋 Conversations fetched:', data);
      
      if (data.success) {
        setConversations(data.conversations || []);
      }
      setInitialLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setInitialLoading(false);
    }
  };

  // ===== FETCH MESSAGES =====
  const fetchMessages = async (conversationId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await fetch(`http://localhost:1000/api/chat/conversations/${conversationId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch messages');
      
      const data = await response.json();
      console.log('💬 Messages fetched:', data);
      
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // ===== FETCH CHAT USERS =====
  const fetchChatUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await fetch('http://localhost:1000/api/chat/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch users');
      
      const data = await response.json();
      console.log('👥 Chat users fetched:', data);
      
      if (data.success) {
        setChatUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // ===== CREATE/OPEN CONVERSATION =====
  const openConversation = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await fetch('http://localhost:1000/api/chat/conversations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
      
      if (!response.ok) throw new Error('Failed to create conversation');
      
      const data = await response.json();
      console.log('📂 Conversation created:', data);
      
      if (data.success) {
        setCurrentConversation(data.conversation);
        setShowUserList(false);
        setShowConversationList(false);
        fetchConversations();
      }
    } catch (error) {
      console.error('Error opening conversation:', error);
      alert('Failed to open conversation');
    }
  };

  // ===== SEND MESSAGE =====
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !currentConversation || !isConnected) {
      if (!isConnected) {
        alert('Please wait for chat connection...');
      }
      return;
    }

    setSending(true);
    const messageContent = newMessage.trim();

    // Get recipient ID
    const recipient = currentConversation.participants?.find(
      p => p._id !== user.id
    );

    console.log('📤 Sending message:', {
      conversationId: currentConversation._id,
      recipientId: recipient?._id,
      content: messageContent
    });

    socket.emit('send_message', {
      conversationId: currentConversation._id,
      recipientId: recipient?._id,
      content: messageContent
    });

    setNewMessage('');
    setSending(false);
    inputRef.current?.focus();

    // Clear typing
    if (isTyping) {
      setIsTyping(false);
      socket.emit('typing', { conversationId: currentConversation._id, isTyping: false });
    }
  };

  // ===== TYPING INDICATOR =====
  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!isTyping && e.target.value.trim() && isConnected) {
      setIsTyping(true);
      socket.emit('typing', { conversationId: currentConversation._id, isTyping: true });
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        socket.emit('typing', { conversationId: currentConversation._id, isTyping: false });
      }
    }, 1000);
  };

  // ===== GET CONVERSATION USER =====
  const getOtherUser = (conversation) => {
    if (!conversation?.participants) return null;
    return conversation.participants.find(p => p._id !== user.id);
  };

  // ===== GET ONLINE STATUS =====
  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  // ===== FORMAT TIME =====
  const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diff < 604800000) return d.toLocaleDateString([], { weekday: 'short' });
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // ===== FORMAT DATE GROUP =====
  const getDateGroup = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d >= today) return 'Today';
    if (d >= yesterday) return 'Yesterday';
    return d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  };

  // If user is viewer - Access Denied
  if (!canChat) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center max-w-md px-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiMessageSquare className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-500 mb-4">
              You don't have permission to access chat. Please contact your administrator.
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Loading state
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-500 font-medium">Loading conversations...</p>
            {socketError && (
              <p className="mt-2 text-sm text-red-500">{socketError}</p>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Connection Status */}
        <div className={`mb-3 px-4 py-2 rounded-xl text-sm flex items-center justify-between ${
          isConnected ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          <span className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
            {isConnected ? ' Connected to chat server' : ' Disconnected - Trying to reconnect...'}
          </span>
          {!isConnected && (
            <button 
              onClick={() => window.location.reload()}
              className="text-sm underline hover:no-underline"
            >
              Refresh
            </button>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden h-[calc(100vh-220px)] flex">
          
          {/* ===== CONVERSATION LIST ===== */}
          <div className={`
            ${showConversationList ? 'w-full sm:w-80' : 'w-0 sm:w-80'} 
            border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden
          `}>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <FiMessageSquare className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-800">Chats</h2>
                {conversations.length > 0 && (
                  <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                    {conversations.length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowUserList(!showUserList)}
                  className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                  title="New Chat"
                >
                  <FiUserPlus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    fetchConversations();
                    fetchChatUsers();
                  }}
                  className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                  title="Refresh"
                >
                  <FiRefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="p-3 border-b border-gray-100 bg-gray-50">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
                />
              </div>
            </div>

            {/* User List (New Chat) */}
            {showUserList && (
              <div className="p-3 border-b border-gray-200 bg-gray-50 max-h-60 overflow-y-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Available Users</span>
                  <button
                    onClick={() => setShowUserList(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
                {chatUsers.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No users available to chat</p>
                ) : (
                  <div className="space-y-1">
                    {chatUsers.map((chatUser) => (
                      <button
                        key={chatUser._id}
                        onClick={() => openConversation(chatUser._id)}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white transition text-left"
                      >
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                            {chatUser.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${isUserOnline(chatUser._id) ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{chatUser.name}</p>
                          <p className="text-xs text-gray-400 capitalize">{chatUser.role}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${isUserOnline(chatUser._id) ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                          {isUserOnline(chatUser._id) ? 'Online' : 'Offline'}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
              {conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <FiMessageSquare className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium">No conversations yet</p>
                  <p className="text-xs text-gray-400 mt-1">Start a new chat by clicking the + button</p>
                </div>
              ) : (
                conversations.map((conv) => {
                  const otherUser = getOtherUser(conv);
                  const isActive = currentConversation?._id === conv._id;
                  
                  return (
                    <button
                      key={conv._id}
                      onClick={() => {
                        setCurrentConversation(conv);
                        setShowConversationList(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 p-3 hover:bg-white transition border-b border-gray-100
                        ${isActive ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : ''}
                      `}
                    >
                      <div className="relative">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                          {otherUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${isUserOnline(otherUser?._id) ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {otherUser?.name || 'Unknown'}
                          {otherUser?.role && (
                            <span className="text-[10px] text-gray-400 ml-1.5 capitalize">
                              • {otherUser.role}
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {conv.lastMessage?.content ? 
                            conv.lastMessage.content.substring(0, 40) + (conv.lastMessage.content.length > 40 ? '...' : '') 
                            : 'No messages yet'}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] text-gray-400">
                          {formatTime(conv.updatedAt)}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* ===== CHAT AREA ===== */}
          <div className="flex-1 flex flex-col bg-white">
            {currentConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowConversationList(true)}
                      className="sm:hidden p-1 text-gray-400 hover:text-gray-600"
                    >
                      <FiChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                        {getOtherUser(currentConversation)?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${isUserOnline(getOtherUser(currentConversation)?._id) ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {getOtherUser(currentConversation)?.name || 'Unknown'}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs ${isUserOnline(getOtherUser(currentConversation)?._id) ? 'text-emerald-600' : 'text-gray-400'}`}>
                          {isUserOnline(getOtherUser(currentConversation)?._id) ? '🟢 Online' : '⚪ Offline'}
                        </span>
                        <span className="text-xs text-gray-400 capitalize">
                          • {getOtherUser(currentConversation)?.role}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                      <FiPhone className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                      <FiVideo className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                      <FiMoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <FiMessageSquare className="w-8 h-8 text-gray-300" />
                      </div>
                      <p className="text-gray-500 font-medium">No messages yet</p>
                      <p className="text-sm text-gray-400 mt-1">Start the conversation!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg, index) => {
                        const isMine = msg.sender?._id === user.id;
                        const showDate = index === 0 || 
                          new Date(msg.createdAt).getDate() !== new Date(messages[index - 1]?.createdAt).getDate();
                        
                        return (
                          <div key={msg._id}>
                            {showDate && (
                              <div className="flex justify-center mb-4">
                                <span className="text-xs bg-gray-200 text-gray-500 px-3 py-1 rounded-full">
                                  {getDateGroup(msg.createdAt)}
                                </span>
                              </div>
                            )}
                            <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[70%] ${isMine ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200'} rounded-2xl px-4 py-2.5 shadow-sm`}>
                                <p className="text-sm break-words whitespace-pre-wrap">{msg.content}</p>
                                <div className={`flex items-center gap-1 mt-1 ${isMine ? 'text-indigo-300' : 'text-gray-400'}`}>
                                  <span className="text-[10px]">{formatTime(msg.createdAt)}</span>
                                  {isMine && <FiCheck className="w-3 h-3" />}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* Typing indicator */}
                      {typingUsers.some(u => u.userId !== user.id) && (
                        <div className="flex justify-start">
                          <div className="bg-gray-200 rounded-2xl px-4 py-2.5">
                            <div className="flex items-center gap-1">
                              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <form onSubmit={sendMessage} className="flex items-center gap-2">
                    <button
                      type="button"
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                    >
                      <FiPaperclip className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition sm:hidden"
                    >
                      <FiSmile className="w-5 h-5" />
                    </button>
                    <input
                      ref={inputRef}
                      type="text"
                      value={newMessage}
                      onChange={handleTyping}
                      placeholder={isConnected ? "Type a message..." : "Connecting..."}
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-sm"
                      disabled={sending || !isConnected}
                    />
                    <button
                      type="button"
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition hidden sm:block"
                    >
                      <FiSmile className="w-5 h-5" />
                    </button>
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || sending || !isConnected}
                      className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sending ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FiSend className="w-5 h-5" />
                      )}
                    </button>
                  </form>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-gray-400 px-1">
                    <span>Press Enter to send</span>
                    {isConnected ? (
                      <span className="text-emerald-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        Connected
                      </span>
                    ) : (
                      <span className="text-red-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                        Disconnected
                      </span>
                    )}
                  </div>
                </div>
              </>
            ) : (
              // No conversation selected
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50/30">
                <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                  <FiMessageSquare className="w-12 h-12 text-indigo-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Your Messages</h3>
                <p className="text-gray-400 max-w-sm">
                  Select a conversation from the sidebar or start a new chat with someone.
                </p>
                <button
                  onClick={() => setShowUserList(true)}
                  className="mt-4 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition flex items-center gap-2"
                >
                  <FiUserPlus className="w-4 h-4" />
                  New Message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}