const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get chat history between two users
// @route   GET /api/chat/:userId
// @access  Private
exports.getChatHistory = async (req, res) => {
  try {
    const otherUserId = req.params.userId;
    const currentUserId = req.user.id;

    const chatRoomId = Message.generateChatRoomId(currentUserId, otherUserId);

    const messages = await Message.find({ chatRoom: chatRoomId })
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar')
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { 
        chatRoom: chatRoomId, 
        receiver: currentUserId,
        read: false 
      },
      { read: true }
    );

    res.status(200).json({
      success: true,
      messages
    });
  } catch (error) {
    console.error('Get Chat History Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching chat history' 
    });
  }
};

// @desc    Get all conversations for current user
// @route   GET /api/chat/conversations
// @access  Private
exports.getConversations = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Get all unique chat rooms involving current user
    const messages = await Message.find({
      $or: [
        { sender: currentUserId },
        { receiver: currentUserId }
      ]
    })
    .populate('sender', 'name avatar email')
    .populate('receiver', 'name avatar email')
    .sort({ createdAt: -1 });

    // Group by chat room and get latest message
    const conversationMap = new Map();
    
    messages.forEach(msg => {
      const otherUser = msg.sender._id.toString() === currentUserId 
        ? msg.receiver 
        : msg.sender;
      
      const chatRoomId = msg.chatRoom;
      
      if (!conversationMap.has(chatRoomId)) {
        conversationMap.set(chatRoomId, {
          chatRoomId,
          otherUser,
          lastMessage: msg.message,
          lastMessageTime: msg.createdAt,
          unreadCount: 0
        });
      }
    });

    // Count unread messages
    for (let [chatRoomId, conversation] of conversationMap) {
      const unreadCount = await Message.countDocuments({
        chatRoom: chatRoomId,
        receiver: currentUserId,
        read: false
      });
      conversation.unreadCount = unreadCount;
    }

    const conversations = Array.from(conversationMap.values());

    res.status(200).json({
      success: true,
      conversations
    });
  } catch (error) {
    console.error('Get Conversations Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching conversations' 
    });
  }
};

// @desc    Send a message (also handled by Socket.IO)
// @route   POST /api/chat/send
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message, productId } = req.body;
    const senderId = req.user.id;

    if (!receiverId || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Receiver and message are required' 
      });
    }

    const chatRoomId = Message.generateChatRoomId(senderId, receiverId);

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

    res.status(201).json({
      success: true,
      message: populatedMessage
    });
  } catch (error) {
    console.error('Send Message Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error sending message' 
    });
  }
};
