# 🚀 Complete Deployment Guide: Vercel, Render, MongoDB Atlas, Cloudinary & Razorpay

This guide walks you through deploying the complete **MERN AI Food Delivery App** to production in less than 5 minutes.

---

## 🏗️ Architecture Overview

| Component | Platform | Service Type | Role |
|---|---|---|---|
| **Frontend** | [Vercel](https://vercel.com) | Static / SPA | React + Vite UI, Redux, Razorpay Checkout, Food Genie |
| **Backend & Socket** | [Render](https://render.com) | Web Service (Node.js) | Express API, Real-Time Socket.io Engine, AI Recommendation Engine |
| **Database** | [MongoDB Atlas](https://cloud.mongodb.com) | Managed Mongo Cluster | Stores 8 Restaurants, 37 Food Items, 560 Reviews, Users & Orders |
| **Media Storage** | [Cloudinary](https://cloudinary.com) | Media CDN | User avatars, restaurant logos, food images |
| **Payment Gateway** | [Razorpay](https://razorpay.com) | Sandbox / Test Mode | UPI (GPay/PhonePe), Credit/Debit Cards, Netbanking in INR |

---

## Step 1: Push Code to GitHub

Open PowerShell in `c:\Project\FoodProjectApp`:

```bash
# 1. Initialize git
git init

# 2. Add all files
git add .

# 3. Commit
git commit -m "feat: complete MERN Food Delivery app with AI, Socket.io, and Razorpay"

# 4. Rename default branch to main
git branch -M main

# 5. Link to your GitHub repository (create a new empty repo on GitHub first)
git remote add origin https://github.com/YOUR_USERNAME/FoodProjectApp.git

# 6. Push code
git push -u origin main
```

---

## Step 2: Deploy Backend & Socket.io on Render

1. Go to [https://render.com](https://render.com) and sign in.
2. Click **New +** &rarr; Select **Web Service**.
3. Connect your GitHub repository (`FoodProjectApp`).
4. Configure service settings:
   - **Name**: `foodapp-backend` (or your preferred name)
   - **Region**: Choose closest to India (e.g., Singapore or Frankfurt/Oregon)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`
5. Click **Advanced** &rarr; **Add Environment Variable** and copy-paste these values:

| Key | Value | Notes |
|---|---|---|
| `PORT` | `8080` | Server port |
| `NODE_ENV` | `PRODUCTION` | Environment mode |
| `DB_URL` | `mongodb://shivyaduvanshi1348_db_user:<YOUR_MONGODB_PASSWORD>@ac-hiygoqh-shard-00-00.kx6iqsy.mongodb.net:27017,ac-hiygoqh-shard-00-01.kx6iqsy.mongodb.net:27017,ac-hiygoqh-shard-00-02.kx6iqsy.mongodb.net:27017/?ssl=true&replicaSet=atlas-fboihl-shard-0&authSource=admin&appName=foodapp` | MongoDB Atlas cluster (enter your actual Atlas password) |
| `JWT_SECRET` | `my-jwt-super-secret-long-key` | Auth token secret |
| `JWT_EXPIRES` | `90d` | Token expiry |
| `CLOUDINARY_CLOUD_NAME` | `l1rgxnhz` | Cloudinary name |
| `CLOUDINARY_API_KEY` | `181319454291549` | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | `rlWOKjbN6sxtaQ2ZOHPce7n2ePY` | Cloudinary Secret |
| `RAZORPAY_KEY_ID` | `rzp_test_1DP5mmOlF5G5ag` | Razorpay Sandbox Key |
| `RAZORPAY_KEY_SECRET` | `sLgJ2R2WpLhF9eQZ7X8mN4kP` | Razorpay Sandbox Secret |
| `FRONTEND_URL` | `https://your-frontend-app.vercel.app` | (Update after Step 3) |

6. Click **Deploy Web Service**.
7. Wait ~2 minutes until Render logs display:
   ```text
   Server started on PORT: 8080 with Socket.io real-time engine
   MongoDB Database connected with HOST: ac-hiygoqh...
   ```
8. **Copy your Render URL**: e.g., `https://foodapp-backend.onrender.com`.

---

## Step 3: Deploy Frontend on Vercel

1. Go to [https://vercel.com](https://vercel.com) and sign in.
2. Click **Add New...** &rarr; Select **Project**.
3. Import your GitHub repository (`FoodProjectApp`).
4. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* &rarr; select **`frontend`**
   - **Build Command**: `vite build` (or leave default)
   - **Output Directory**: `dist`
5. Expand **Environment Variables** and add:

| Name | Value |
|---|---|
| `VITE_BACKEND_URL` | `https://foodapp-backend.onrender.com` *(Paste your Render backend URL from Step 2)* |

6. Click **Deploy**.
7. In ~30 seconds, Vercel will complete the build and assign your production domain:
   👉 `https://your-app.vercel.app`

*(Optional)*: Return to Render, edit the `FRONTEND_URL` environment variable to match your new Vercel domain, and click Save.

---

## Step 4: Verification Checklist

Once both services are deployed:

1. **Visit your Vercel URL**:
   - Verify all 8 restaurants load from MongoDB Atlas.
   - Click the **"✨ AI Recommendation For You"** banner & test 1-click ordering.
   - Open **"🧞 Food Genie"** floating chatbot and ask for food picks.
   - Click **"📊 Deep AI Analytics"** to inspect customer sentiment on 560 reviews.
2. **Test User Authentication**:
   - Register a new account (Cloudinary handles avatar upload).
3. **Test Razorpay Sandbox Payment**:
   - Add items to cart & proceed to `/payment`.
   - Select **⚡ Razorpay (Sandbox)** & click Pay.
   - The native Razorpay checkout modal opens. Select **UPI / Card / Netbanking** in Test Mode & submit.
   - Payment signature verifies via HMAC SHA-256 and directs to Order Success!
4. **Test Real-Time Socket.io**:
   - Open your order details page. Notice the **⚡ Live Socket Tracking** status indicator updates automatically when backend emits `orderStatusUpdate`!
