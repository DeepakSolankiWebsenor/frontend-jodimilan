import { io } from 'socket.io-client';
import { API_BASE_URL } from './appConfig';

class SocketService {
  socket = null;
  isConnected = false;
  reconnectAttempts = 0;
  maxReconnectAttempts = 5;
  listeners = new Map();

  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    // Use API_BASE_URL from appConfig, removing /api for the socket connection
    let SOCKET_URL = API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3006';
    
    if (SOCKET_URL.endsWith('/api/')) {
      SOCKET_URL = SOCKET_URL.slice(0, -5);
    } else if (SOCKET_URL.endsWith('/api')) {
      SOCKET_URL = SOCKET_URL.slice(0, -4);
    }

    console.log('🔌 Connecting to Socket.IO server:', SOCKET_URL);

    this.socket = io(SOCKET_URL, {
      auth: {
        token: token,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupEventListeners();
  }

  setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.emit('connection:success');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      this.isConnected = false;
      this.emit('connection:lost', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message);
      console.error('Full error:', error);
      this.reconnectAttempts++;
      this.emit('connection:error', error);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
      this.emit('connection:reconnected', attemptNumber);
    });

    // Real-time event listeners
    this.socket.on('message:new', (data) => {
      console.log('📨 New message received:', data);
      this.emit('message:new', data);
    });

    this.socket.on('message:status', (data) => {
      console.log('📊 Message status update:', data);
      this.emit('message:status', data);
    });

    this.socket.on('messages:read', (data) => {
      this.emit('messages:read', data);
    });

    this.socket.on('typing:start', (data) => {
      console.log('⌨️ Typing started:', data);
      this.emit('typing:start', data);
    });

    this.socket.on('typing:stop', (data) => {
      this.emit('typing:stop', data);
    });

    this.socket.on('user:presence', (data) => {
      this.emit('user:presence', data);
    });
  }

  // Join a chat session room
  joinSession(sessionId) {
    if (this.socket?.connected) {
      this.socket.emit('join:session', sessionId);
      console.log('🚺 Joined session room:', sessionId);
    } else {
      console.warn('⚠️ Cannot join session - socket not connected');
    }
  }

  // Leave a chat session room
  leaveSession(sessionId) {
    if (this.socket?.connected) {
      this.socket.emit('leave:session', sessionId);
      console.log('Left session:', sessionId);
    }
  }

  // Emit typing start
  startTyping(sessionId, userId, userName) {
    if (this.socket?.connected) {
      this.socket.emit('typing:start', { sessionId, userId, userName });
    }
  }

  // Emit typing stop
  stopTyping(sessionId, userId) {
    if (this.socket?.connected) {
      this.socket.emit('typing:stop', { sessionId, userId });
    }
  }

  // Emit message delivered
  messageDelivered(sessionId, messageId, fromUserId, toUserId) {
    if (this.socket?.connected) {
      this.socket.emit('message:delivered', {
        sessionId,
        messageId,
        fromUserId,
        toUserId,
      });
    }
  }

  // Emit message delivered
  messageDelivered(sessionId, messageId, fromUserId, toUserId) {
    if (this.socket?.connected) {
      this.socket.emit('message:delivered', {
        sessionId,
        messageId,
        fromUserId,
        toUserId,
      });
    }
  }

  // Emit message read
  messageRead(sessionId, messageId, fromUserId, toUserId) {
    if (this.socket?.connected) {
      this.socket.emit('message:read', {
        sessionId,
        messageId,
        fromUserId,
        toUserId,
      });
    }
  }

  // Event listener management
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return;
    const callbacks = this.listeners.get(event);
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  emit(event, data) {
    if (!this.listeners.has(event)) return;
    this.listeners.get(event).forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in listener for ${event}:`, error);
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
      console.log('Socket disconnected manually');
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.socket?.id,
      reconnectAttempts: this.reconnectAttempts,
    };
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
