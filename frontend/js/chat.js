// ========================================
// REAL-TIME CHAT FUNCTIONALITY
// ========================================

const API_URL = 'http://localhost:3000/api';
const SOCKET_URL = 'http://localhost:3000';

// Check authentication
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'login.html';
}

// Get current user
const currentUser = JSON.parse(localStorage.getItem('user'));
if (!currentUser) {
    window.location.href = 'login.html';
}

// Initialize Socket.IO
const socket = io(SOCKET_URL);

// Current chat state
let currentChatUser = null;
let currentChatRoomId = null;
let typingTimeout = null;

// Logout functionality
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        socket.disconnect();
        localStorage.clear();
        window.location.href = 'login.html';
    });
}

// Socket.IO connection
socket.on('connect', () => {
    console.log('✅ Connected to chat server');
    socket.emit('user:join', currentUser.id);
});

socket.on('disconnect', () => {
    console.log('❌ Disconnected from chat server');
});

// Load conversations
async function loadConversations() {
    try {
        const response = await fetch(`${API_URL}/chat/conversations`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        
        const conversationsList = document.getElementById('conversations-list');
        
        if (data.success && data.conversations.length > 0) {
            conversationsList.innerHTML = data.conversations.map(conv => `
                <div class="conversation-item" data-user-id="${conv.otherUser._id}" 
                     data-chat-room="${conv.chatRoomId}">
                    <img src="${conv.otherUser.avatar}" alt="${conv.otherUser.name}" class="conversation-avatar">
                    <div class="conversation-info">
                        <h4>${conv.otherUser.name}</h4>
                        <p class="last-message">${conv.lastMessage.substring(0, 30)}...</p>
                    </div>
                    ${conv.unreadCount > 0 ? `<span class="unread-badge">${conv.unreadCount}</span>` : ''}
                </div>
            `).join('');

            // Add click listeners
            document.querySelectorAll('.conversation-item').forEach(item => {
                item.addEventListener('click', () => {
                    const userId = item.dataset.userId;
                    const chatRoomId = item.dataset.chatRoom;
                    openChat(userId, chatRoomId);
                });
            });
        } else {
            conversationsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No conversations yet</p>';
        }
    } catch (error) {
        console.error('Error loading conversations:', error);
    }
}

// Open chat with user
async function openChat(userId, chatRoomId) {
    try {
        // Get user details
        const userResponse = await fetch(`${API_URL}/products`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        // Load chat history
        const response = await fetch(`${API_URL}/chat/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();
        
        if (data.success) {
            // Update current chat state
            currentChatUser = { _id: userId };
            currentChatRoomId = chatRoomId;
            
            // Show chat window
            document.getElementById('no-chat-selected').style.display = 'none';
            document.getElementById('chat-window').style.display = 'flex';
            
            // Update header
            const firstMessage = data.messages[0];
            if (firstMessage) {
                const otherUser = firstMessage.sender._id === currentUser.id 
                    ? firstMessage.receiver 
                    : firstMessage.sender;
                
                document.getElementById('chat-user-avatar').src = otherUser.avatar;
                document.getElementById('chat-user-name').textContent = otherUser.name;
            }
            
            // Display messages
            displayMessages(data.messages);
            
            // Join chat room
            socket.emit('chat:join', { chatRoomId });
        }
    } catch (error) {
        console.error('Error opening chat:', error);
    }
}

// Display messages
function displayMessages(messages) {
    const container = document.getElementById('messages-container');
    
    container.innerHTML = messages.map(msg => {
        const isSent = msg.sender._id === currentUser.id;
        return `
            <div class="message ${isSent ? 'message-sent' : 'message-received'}">
                ${!isSent ? `<img src="${msg.sender.avatar}" alt="${msg.sender.name}" class="message-avatar">` : ''}
                <div class="message-content">
                    <p>${msg.message}</p>
                    <span class="message-time">${new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                ${isSent ? `<img src="${msg.sender.avatar}" alt="${msg.sender.name}" class="message-avatar">` : ''}
            </div>
        `;
    }).join('');
    
    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
}

// Send message
const sendBtn = document.getElementById('send-btn');
const messageInput = document.getElementById('message-input');

if (sendBtn && messageInput) {
    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

function sendMessage() {
    const message = messageInput.value.trim();
    
    if (!message || !currentChatUser || !currentChatRoomId) {
        return;
    }
    
    // Emit message via Socket.IO
    socket.emit('chat:message', {
        senderId: currentUser.id,
        receiverId: currentChatUser._id,
        message,
        chatRoomId: currentChatRoomId
    });
    
    // Clear input
    messageInput.value = '';
    
    // Stop typing indicator
    socket.emit('chat:stop-typing', { chatRoomId: currentChatRoomId });
}

// Typing indicator
if (messageInput) {
    messageInput.addEventListener('input', () => {
        if (currentChatRoomId) {
            socket.emit('chat:typing', {
                chatRoomId: currentChatRoomId,
                userName: currentUser.name
            });
            
            // Clear existing timeout
            clearTimeout(typingTimeout);
            
            // Stop typing after 2 seconds of inactivity
            typingTimeout = setTimeout(() => {
                socket.emit('chat:stop-typing', { chatRoomId: currentChatRoomId });
            }, 2000);
        }
    });
}

// Listen for new messages
socket.on('chat:message', (message) => {
    if (currentChatRoomId === message.chatRoom) {
        // Add message to current chat
        const container = document.getElementById('messages-container');
        const isSent = message.sender._id === currentUser.id;
        
        const messageEl = document.createElement('div');
        messageEl.className = `message ${isSent ? 'message-sent' : 'message-received'}`;
        messageEl.innerHTML = `
            ${!isSent ? `<img src="${message.sender.avatar}" alt="${message.sender.name}" class="message-avatar">` : ''}
            <div class="message-content">
                <p>${message.message}</p>
                <span class="message-time">${new Date(message.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
            ${isSent ? `<img src="${message.sender.avatar}" alt="${message.sender.name}" class="message-avatar">` : ''}
        `;
        
        container.appendChild(messageEl);
        container.scrollTop = container.scrollHeight;
    }
    
    // Reload conversations to update last message
    loadConversations();
});

// Listen for typing indicator
socket.on('chat:typing', ({ userName }) => {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.innerHTML = `<p>${userName} is typing<span>.</span><span>.</span><span>.</span></p>`;
        indicator.style.display = 'block';
    }
});

socket.on('chat:stop-typing', () => {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.style.display = 'none';
    }
});

// Handle chat from URL parameter (e.g., chat.html?user=123)
const urlParams = new URLSearchParams(window.location.search);
const userIdParam = urlParams.get('user');

if (userIdParam) {
    // Generate chat room ID
    const chatRoomId = [currentUser.id, userIdParam].sort().join('_');
    openChat(userIdParam, chatRoomId);
}

// Initialize
loadConversations();
updateCartCount();

// CSS for additional chat styling
const chatStyles = `
.conversation-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    margin-bottom: 8px;
}

.conversation-item:hover {
    background: var(--bg-secondary);
}

.conversation-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
}

.conversation-info {
    flex: 1;
}

.conversation-info h4 {
    margin: 0;
    font-size: 1rem;
    color: var(--text-primary);
}

.last-message {
    margin: 0;
    font-size: 0.85rem;
    color: var(--text-secondary);
}

.unread-badge {
    background: var(--error);
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: bold;
}

.message-avatar {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    object-fit: cover;
}

.message-time {
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin-top: 4px;
    display: block;
}

.typing-indicator {
    padding: 12px;
    color: var(--text-secondary);
    font-size: 0.9rem;
}

.typing-indicator span {
    animation: blink 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes blink {
    0%, 20% { opacity: 1; }
    50% { opacity: 0; }
    100% { opacity: 1; }
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = chatStyles;
document.head.appendChild(styleSheet);
