# 🎓 Online Student Resource Hub

> A modern full-stack e-commerce platform for students to buy and sell academic resources with real-time chat functionality.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![MongoDB](https://img.shields.io/badge/mongodb-%3E%3D4.0-green.svg)

---

## 🎥 Live Demo

### Video Demonstration

[![Watch Demo Video](https://img.shields.io/badge/▶️_Watch_Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://github.com/Vidsp21/Online-Student-Resource-Hub/releases/tag/v1.0.0)

<!-- Alternative: If you uploaded video to demo folder, use this instead:
https://user-images.githubusercontent.com/YOUR_VIDEO_FILE.mp4
-->

### Quick Preview

🏠 **Landing Page** → User-friendly hero section with CTA buttons  
🔐 **Authentication** → Secure login/register with JWT  
🛍️ **Product Shop** → Browse, search, and filter products  
🛒 **Shopping Cart** → Add items, manage quantities, checkout  
💬 **Real-Time Chat** → Instant messaging with Socket.IO  
📊 **Dashboard** → Manage profile, orders, and listings  
🌗 **Dark Mode** → Beautiful theme toggle

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

**Online Student Resource Hub** is a dedicated marketplace platform designed for college students to buy and sell academic resources including books, notes, stationery, and electronics. The platform features real-time chat capabilities, secure authentication, and a modern UI with dark mode support.

### 🎯 Project Goals

- Provide an affordable way for students to access academic materials
- Connect buyers and sellers within the campus community
- Enable real-time communication between students
- Create a user-friendly, modern interface
- Demonstrate full-stack web development skills

---

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login
- JWT-based authentication
- Role-based access (Buyer, Seller, Both)
- Session persistence
- Secure password hashing with bcrypt

### 🛍️ E-Commerce Functionality
- Product listing and browsing
- Advanced search and filtering
- Category-based navigation
- Shopping cart management
- Order placement and tracking
- Seller dashboard for managing listings

### 💬 Real-Time Chat
- One-to-one messaging between buyers and sellers
- Socket.IO powered real-time communication
- Online/offline status indicators
- Typing indicators
- Message history persistence
- Chat notifications

### 🎨 User Interface
- Modern, responsive design
- Blue & Purple gradient theme
- Dark mode / Light mode toggle
- Smooth animations and transitions
- Mobile-friendly layout
- Intuitive navigation

### 📊 Dashboard
- User profile management
- Order history
- Product listing management
- Active conversations overview
- Sales analytics

---

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables
- **Vanilla JavaScript** - No frameworks, pure JS
- **Socket.IO Client** - Real-time communication

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.IO** - WebSocket library for real-time features

### Security & Authentication
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Development Tools
- **Nodemon** - Auto-restart during development
- **dotenv** - Environment variable management

---

## 📁 Project Structure

```
online-student-resource-hub/
│
├── frontend/                      # Client-side application
│   ├── index.html                # Landing page
│   ├── login.html                # Login page
│   ├── register.html             # Registration page
│   ├── shop.html                 # Product browsing
│   ├── cart.html                 # Shopping cart
│   ├── chat.html                 # Real-time chat interface
│   ├── dashboard.html            # User dashboard
│   │
│   ├── css/
│   │   ├── style.css            # Main stylesheet
│   │   └── dark-mode.css        # Dark theme styles
│   │
│   └── js/
│       ├── auth.js              # Authentication logic
│       ├── cart.js              # Shopping cart functionality
│       ├── chat.js              # Real-time chat with Socket.IO
│       └── theme.js             # Dark/Light mode toggle
│
├── backend/                       # Server-side application
│   ├── server.js                 # Main server file with Socket.IO
│   │
│   ├── config/
│   │   └── db.js                # Database connection
│   │
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Product.js           # Product schema
│   │   ├── Message.js           # Message schema
│   │   └── Order.js             # Order schema
│   │
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── productController.js # Product CRUD operations
│   │   ├── chatController.js    # Chat management
│   │   └── orderController.js   # Order processing
│   │
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── productRoutes.js     # Product endpoints
│   │   ├── chatRoutes.js        # Chat endpoints
│   │   └── orderRoutes.js       # Order endpoints
│   │
│   └── middleware/
│       └── auth.js              # JWT verification middleware
│
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore file
├── package.json                  # Project dependencies
├── LICENSE                       # MIT License
└── README.md                     # Project documentation
```

---

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/online-student-resource-hub.git
cd online-student-resource-hub
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`.

---

## ⚙️ Configuration

### Step 1: Create Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

### Step 2: Configure Environment Variables

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/student-hub

# JWT Secret (use a strong random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Session Secret
SESSION_SECRET=your_session_secret_key_change_this

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Step 3: Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

---

## 🎮 Running the Application

### Development Mode (with auto-restart)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:3000`

### Accessing the Application

1. Open your browser
2. Navigate to `http://localhost:3000`
3. Register a new account or login
4. Start exploring!

---

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "buyer" | "seller" | "both"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Product Endpoints

#### Get All Products
```http
GET /api/products?category=Books&search=calculus
Authorization: Bearer <token>
```

#### Get Single Product
```http
GET /api/products/:id
Authorization: Bearer <token>
```

#### Create Product (Seller only)
```http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Calculus Textbook",
  "description": "2nd Edition, like new",
  "price": 500,
  "category": "Books",
  "condition": "Like New",
  "stock": 1
}
```

### Chat Endpoints

#### Get Conversations
```http
GET /api/chat/conversations
Authorization: Bearer <token>
```

#### Get Chat History
```http
GET /api/chat/:userId
Authorization: Bearer <token>
```

#### Send Message
```http
POST /api/chat/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "receiverId": "user_id",
  "message": "Hello!"
}
```

### Order Endpoints

#### Create Order
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "productId": "product_id",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "street": "123 College St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "phone": "9876543210"
  },
  "paymentMethod": "cash"
}
```

## �🔮 Future Enhancements

### Phase 1 - Immediate Improvements
- [ ] Image upload functionality (AWS S3 / Cloudinary)
- [ ] Email verification and password reset
- [ ] Product reviews and ratings
- [ ] Advanced search with filters
- [ ] Bookmark/wishlist feature

### Phase 2 - Advanced Features
- [ ] **Blockchain Integration**
  - Cryptocurrency payment support
  - Smart contracts for escrow
  - Transparent transaction history
  - Integration points marked in code

- [ ] **IoT Integration**
  - Smart inventory tracking
  - RFID-based product verification
  - Real-time stock updates
  - IoT device management dashboard
  - Integration placeholders in Product model

- [ ] Push notifications
- [ ] Video calls for product verification
- [ ] Seller verification badges
- [ ] Analytics dashboard

### Phase 3 - Scalability
- [ ] Microservices architecture
- [ ] Redis caching
- [ ] CDN integration
- [ ] Load balancing
- [ ] Docker containerization
- [ ] Kubernetes deployment

---

## 🏗️ Architecture Notes

### Blockchain Integration (Future)
The codebase is prepared for blockchain payment integration:

```javascript
// In Product.js model
// blockchainTxHash: String,        // Transaction hash
// iotDeviceId: String,              // IoT device identifier
// iotLastSync: Date                 // Last sync timestamp

// In Order.js model
// blockchainTxHash: String,         // Payment transaction hash
// blockchainNetwork: String         // Ethereum, Polygon, etc.
```

### IoT Integration (Future)
Inventory tracking with IoT devices:

```javascript
// Future IoT API endpoint structure
// POST /api/iot/sync
// - Update stock based on RFID scans
// - Real-time inventory alerts
// - Automatic restock notifications
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style Guidelines
- Use ES6+ features
- Follow existing naming conventions
- Comment complex logic
- Write clean, readable code
- Test before committing

---

## 🐛 Bug Reports

If you discover a bug, please create an issue on GitHub with:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Screenshots (if applicable)
- Your environment details

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@vidsp21](https://github.com/vidsp21)
- LinkedIn: [Vidula Patil](https://linkedin.com/in/vidula-patil-61a902282)

---

## 🙏 Acknowledgments

- Built as a college final year project
- Inspired by modern e-commerce platforms
- Special thanks to the open-source community
- Icons and images from placeholder services

---

## 🎓 Educational Purpose

This project demonstrates:
- Full-stack web development
- RESTful API design
- Real-time communication with WebSockets
- Database design and modeling
- Authentication and authorization
- Modern UI/UX principles
- Responsive web design
- Clean code architecture

Perfect for showcasing in:
- College projects
- Job interviews
- Portfolio websites
- GitHub profile

---

<div align="center">

**Made with ❤️ by students, for students**

⭐ Star this repo if you find it helpful!

</div>
