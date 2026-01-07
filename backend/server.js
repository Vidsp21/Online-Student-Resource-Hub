const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const Message = require('./models/Message');
const User = require('./models/User');

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const chatRoutes = require('./routes/chatRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST']
  }
});

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/orders', orderRoutes);

// Root API endpoint (for API documentation)
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Online Student Resource Hub API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      chat: '/api/chat',
      orders: '/api/orders'
    }
  });
});

// Serve frontend pages - only for non-API routes
app.get('*', (req, res) => {
  // Don't interfere with API routes
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API endpoint not found' });
  }
  
  // Serve the appropriate HTML file or default to index.html
  let filePath = path.join(__dirname, '../frontend', req.path);
  
  // If path doesn't have .html extension and file doesn't exist, try adding .html
  if (!req.path.includes('.') && !req.path.endsWith('/')) {
    filePath = path.join(__dirname, '../frontend', `${req.path}.html`);
  }
  
  // Default to index.html for root and non-existent paths
  res.sendFile(filePath, (err) => {
    if (err) {
      res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
    }
  });
});

// Socket.IO Connection Handling
const activeUsers = new Map(); // userId -> socketId mapping

io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  // User joins with their user ID
  socket.on('user:join', (userId) => {
    activeUsers.set(userId, socket.id);
    socket.userId = userId;
    console.log(`👤 User ${userId} joined with socket ${socket.id}`);
    
    // Broadcast online status
    io.emit('user:online', { userId, socketId: socket.id });
  });

  // Join specific chat room
  socket.on('chat:join', ({ chatRoomId }) => {
    socket.join(chatRoomId);
    console.log(`💬 User ${socket.userId} joined chat room: ${chatRoomId}`);
  });

  // Handle incoming messages
  socket.on('chat:message', async (data) => {
    try {
      const { senderId, receiverId, message, chatRoomId, productId } = data;

      // Save message to database
      const newMessage = await Message.create({
        chatRoom: chatRoomId,
        sender: senderId,
        receiver: receiverId,
        message,
        productReference: productId || null
      });

      const populatedMessage = await Message.findById(newMessage._id)
        .populate('sender', 'name avatar')
        .populate('receiver', 'name avatar');

      // Emit to chat room
      io.to(chatRoomId).emit('chat:message', populatedMessage);

      // Send notification to receiver if they're online but not in this chat room
      const receiverSocketId = activeUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('chat:notification', {
          from: populatedMessage.sender,
          message: message.substring(0, 50),
          chatRoomId
        });
      }

      console.log(`📨 Message sent in room ${chatRoomId}`);
    } catch (error) {
      console.error('Socket Message Error:', error);
      socket.emit('chat:error', { message: 'Failed to send message' });
    }
  });

  // Typing indicator
  socket.on('chat:typing', ({ chatRoomId, userName }) => {
    socket.to(chatRoomId).emit('chat:typing', { userName });
  });

  socket.on('chat:stop-typing', ({ chatRoomId }) => {
    socket.to(chatRoomId).emit('chat:stop-typing');
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    if (socket.userId) {
      activeUsers.delete(socket.userId);
      io.emit('user:offline', { userId: socket.userId });
      console.log(`❌ User ${socket.userId} disconnected`);
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start server
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║   🎓 ONLINE STUDENT RESOURCE HUB SERVER 🎓   ║
╠════════════════════════════════════════════════╣
║  🚀 Server running on port ${PORT}              ║
║  🌐 API: http://localhost:${PORT}/api          ║
║  💬 Socket.IO: Connected                      ║
║  📁 Environment: ${process.env.NODE_ENV || 'development'}              ║
╚════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = { app, server, io };
