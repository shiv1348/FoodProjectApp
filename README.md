# 🍔 FoodProjectApp - Full-Stack MERN Food Delivery Platform

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://frontend-zeta-brown-h3bn8mnwqb.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/shiv1348/FoodProjectApp)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Sandbox-0C2340?style=for-the-badge&logo=razorpay&logoColor=blue)](https://razorpay.com/)

A modern, production-ready Full-Stack MERN Food Delivery application featuring an AI-powered culinary assistant, live WebSocket order tracking, 560-review sentiment analytics, dual payment gateway (Razorpay & Stripe), and automated cloud deployment.

---

## 🌐 Live Deployments & Links

- **Frontend (Vercel)**: [https://frontend-zeta-brown-h3bn8mnwqb.vercel.app](https://frontend-zeta-brown-h3bn8mnwqb.vercel.app)
- **GitHub Repository**: [https://github.com/shiv1348/FoodProjectApp](https://github.com/shiv1348/FoodProjectApp)
- **Database**: MongoDB Atlas Cloud Cluster

---

## ✨ Key Features

### 1. 🍽️ Restaurant & Menu Discovery
- Dynamic restaurant listing with search, pure veg filter, rating filters, and review counts.
- Category-based menu browsing (Starters, Main Course, Desserts, Beverages) with high-res food images and stock status.

### 2. 🤖 Food Genie — Conversational AI Assistant
- Interactive floating AI concierge accessible across all pages.
- Understands cravings, dietary restrictions (vegan, high-protein, gluten-free), spice levels, and budget constraints.
- Recommends tailored dishes with instant 1-click cart addition.

### 3. 🌟 "AI Recommendation For You" Hero Banner
- Smart recommendation banner at the top of the restaurant menu showcase.
- Highlights high-rated, trending dishes with estimated prep times and flavor tags.

### 4. 📊 560-Review Sentiment & Dish Analytics
- Interactive modal aggregating 560+ customer reviews from MongoDB Atlas.
- Sentiment breakdown (Positive / Neutral / Negative) with customer satisfaction percentage scores.
- Popular keywords, dish-specific ratings, and verified review feeds.

### 5. ⚡ Real-Time Live Order Tracking (Socket.io)
- Integrated WebSockets server attached directly to the Node HTTP backend.
- Dynamic room joining (`joinOrder`) with live status broadcasting (`orderStatusUpdate`).
- Real-time updates for Order Processing &rarr; Dispatched &rarr; Out for Delivery &rarr; Delivered without page refresh.

### 6. 💳 Dual Payment Gateway (Razorpay & Stripe)
- **Razorpay Sandbox**: Complete integration supporting UPI (Google Pay, PhonePe), Credit/Debit Cards, and Netbanking with HMAC-SHA256 server-side signature verification.
- Seamless fallback and sandbox testing mechanisms for continuous reliability.

### 7. 🛒 Modern Cart & Checkout Workflow
- Multi-step checkout process: **Delivery Details &rarr; Confirm Order &rarr; Payment &rarr; Order Confirmation**.
- Floating Sticky Cart Bar for seamless mobile browsing and one-tap checkout.
- Delivery location badge in the header displaying active delivery address.

### 8. 🔐 Authentication & User Profile
- Secure JWT-based authentication with bcrypt password hashing.
- Profile management, password updates, avatar uploads, and order history tracking.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **State Management**: Redux Toolkit & React-Redux
- **Routing**: React Router DOM (v6)
- **Real-Time Client**: Socket.io-Client
- **Styling**: Vanilla CSS, Glassmorphic Design System, FontAwesome Icons
- **Deployment**: Vercel

### Backend
- **Runtime**: Node.js & Express.js
- **Real-Time Engine**: Socket.io
- **Database ODM**: Mongoose
- **Payments**: Razorpay SDK & Stripe SDK
- **Media & Storage**: Cloudinary
- **Security & Auth**: JSON Web Tokens (JWT), bcryptjs, validator
- **Deployment**: Render

---

## 📁 Repository Structure

```
FoodProjectApp/
├── backend/
│   ├── config/              # Database connection and Cloudinary config
│   ├── controllers/         # API controllers (AI, Auth, Cart, Order, Razorpay, etc.)
│   ├── middlewares/         # Authentication and error handling middlewares
│   ├── models/              # Mongoose database models (User, Restaurant, FoodItem, Order)
│   ├── routes/              # Express API route declarations
│   ├── utils/               # Seeders, email handlers, and API features
│   ├── server.js            # Node HTTP server with Socket.io integration
│   └── app.js               # Express application configuration & CORS
├── frontend/
│   ├── public/              # Static public assets, logos, and icons
│   ├── src/
│   │   ├── Components/      # UI components (Home, Menu, Cart, Order, User, etc.)
│   │   │   ├── ai/          # Food Genie AI Chat & Recommendation Banner
│   │   │   ├── analytics/   # 560-Review Sentiment Analytics Modal
│   │   │   ├── cart/        # Cart, Checkout Steps, Payment (Razorpay), Sticky Cart
│   │   │   └── order/       # Order Details with Live Socket Tracking
│   │   ├── redux/           # Redux slices and asynchronous actions
│   │   ├── utils/           # API axios instance and Socket.io singleton client
│   │   ├── App.jsx          # Root application component & route configuration
│   │   └── main.jsx         # Vite entry point
│   ├── vercel.json          # Vercel SPA routing and Vite framework preset
│   └── vite.config.js       # Vite configuration with proxy settings
├── DEPLOYMENT_GUIDE.md      # Detailed step-by-step production deployment guide
├── render.yaml              # Render web service blueprint configuration
└── README.md                # Project documentation
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas connection string or local MongoDB instance

### 1. Clone the Repository
```bash
git clone https://github.com/shiv1348/FoodProjectApp.git
cd FoodProjectApp
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `config/config.env` file in the `backend/` directory:
```env
PORT=8080
NODE_ENV=DEVELOPMENT
DB_LOCAL_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_TIME=7d
COOKIE_EXPIRES_TIME=7
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
FRONTEND_URL=http://localhost:5173
```

Start the backend server:
```bash
node server.js
```

### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## ☁️ Deployment

For complete, step-by-step instructions on deploying the full stack to **Vercel** and **Render**, refer to [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

---

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.
