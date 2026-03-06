# 🍽️ MealMate — Smart Meal Subscription & Ordering Platform

![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![Express](https://img.shields.io/badge/Framework-Express.js-black)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)
![License](https://img.shields.io/badge/License-MIT-green)

MealMate is a **smart meal management and subscription platform** designed to simplify how students browse meals, subscribe to plans, and place food orders.  
The platform helps reduce long queues, improves meal planning, and provides an organized food ordering system for campus environments.

---

# ✨ Features

### 🔐 Authentication & Security
- Secure **JWT authentication**
- **Refresh token** management
- Password reset functionality
- Role-based user access

### 🍛 Smart Menu System
- Browse dishes by **category**
- **Search dishes** instantly
- View dish details and availability

### 🛒 Cart & Ordering
- Add/remove dishes from cart
- Manage quantities easily
- Place orders smoothly

### 📅 Pickup Slot Scheduling
- Choose **available pickup time slots**
- Prevent long queues at cafeterias
- Organized meal distribution

## 💳 Payment Integration
MealMate supports **secure digital payments**.

### Supported Gateway
- 💜 Khalti Digital Wallet

### Payment Features
- Secure checkout
- Payment verification
- Transaction tracking
- Payment status management

### 💳 Subscription Plans
Students can subscribe to **weekly or monthly meal plans**:

- Weekly Veg Delight
- Weekly Basic
- Weekly Power Pack
- Weekly Premium
- Monthly Veg Delight
- Monthly Basic
- Monthly Power Pack
- Monthly Premium

### ⭐ Feedback System
- Rate dishes
- Leave comments
- Improve food quality through feedback

### 📦 Inventory Tracking
- Track ingredients used in dishes
- Maintain stock availability

### 🔔 Notifications
- Order updates
- System alerts
- Subscription notifications

### 💬 Chat System
- Built-in messaging system
- Communication with support/admin

---

# 🧠 Tech Stack

## Frontend
- ⚛️ React
- 🎨 Tailwind CSS

## Backend
- 🟢 Node.js
- 🚀 Express.js
- 🔗 Prisma ORM

## Database
- 🐘 PostgreSQL

## Tools & Utilities
- 🔐 JWT Authentication
- 📡 REST APIs
- 🐙 Git & GitHub

---

# 🗂️ Project Structure

MealMate
│
├── backend
│ ├── controllers
│ ├── routes
│ ├── middlewares
│ ├── prisma
│ └── utils
│
├── frontend
│ ├── components
│ ├── pages
│ ├── hooks
│ └── services
│
└── README.md


---

# 🗄️ Database Design

Main entities used in the system:

- **User**
- **Role**
- **Dish**
- **Category**
- **Cart**
- **CartItem**
- **Order**
- **OrderItem**
- **SubscriptionPlan**
- **UserSubscription**
- **Feedback**
- **InventoryItem**
- **DishIngredient**
- **PickupSlot**
- **Payment**
- **Notification**
- **Conversation**
- **Message**
- **RefreshToken**
- **PasswordResetToken**

The database is designed using **Prisma ORM with PostgreSQL**.

---

# 🚀 Getting Started

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/mealmate.git
cd mealmate
