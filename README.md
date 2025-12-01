# Shop Hub - MERN Stack E-Commerce Platform

A full-stack e-commerce web application built with React, Node.js, Express, and MongoDB. Features secure authentication, product management, shopping cart, Razorpay payment integration, and admin dashboard.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Third-Party Libraries](#third-party-libraries)
- [Screenshots](#screenshots)
- [GitHub Repository](#github-repository)

## 🎯 Project Overview

Shop Hub is a modern e-commerce platform that provides a complete online shopping experience. The application includes user authentication, product browsing, shopping cart management, secure payment processing, and an admin dashboard for managing products and users.

### Main Functionalities

1. **User Authentication**: Secure registration and login with JWT tokens
2. **Product Management**: Browse, search, and filter products by category
3. **Shopping Cart**: Add/remove items with persistent cart across sessions
4. **Checkout & Payment**: Razorpay integration with validated shipping address
5. **Order Management**: View order history with estimated delivery dates and auto status updates
6. **Order Cancellation**: Cancel orders (one day before delivery) with refund processing
7. **Admin Dashboard**: Dedicated admin-only interface for managing products, users, and viewing statistics
8. **Pincode Validation**: Check delivery serviceability and validate pincode against selected city
9. **Admin Access Control**: Separate admin interface with restricted access to shopping features

## ✨ Features

- ✅ Responsive design (mobile-first approach)
- ✅ Secure authentication with JWT
- ✅ Real-time cart updates with localStorage persistence
- ✅ Payment gateway integration (Razorpay)
- ✅ Order tracking with estimated delivery dates
- ✅ Automatic order status updates (pending → delivered)
- ✅ Order cancellation with refund processing
- ✅ Cancelled orders management page
- ✅ Admin panel for product/user management
- ✅ Admin-only interface (separate from shopping interface)
- ✅ Admin access restrictions (cannot access shopping pages or add to cart)
- ✅ Revenue calculation (excludes cancelled orders, only counts completed payments)
- ✅ Advanced checkout validation (state, city, pincode matching)
- ✅ Pincode validation against selected city
- ✅ Form validation with error handling
- ✅ Server-side rendering with EJS

## 🛠 Technology Stack

### Frontend

- **React 18** with TypeScript
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router DOM** - Navigation
- **Axios** - HTTP client
- **Shadcn UI** - Component library
- **Lucide React** - Icons

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Razorpay** - Payment gateway
- **EJS** - Template engine
- **Morgan** - HTTP logger
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
shop-hub-208-mern/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Product.js            # Product schema
│   │   └── Order.js              # Order schema
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   ├── products.js            # Product routes
│   │   ├── orders.js             # Order routes
│   │   ├── payments.js           # Payment routes
│   │   └── admin.js              # Admin routes
│   ├── utils/
│   │   └── orderStatusUpdater.js # Order status automation
│   ├── views/
│   │   ├── index.ejs             # Home page (SSR)
│   │   └── about.ejs             # About page (SSR)
│   ├── public/                   # Static files
│   ├── server.js                 # Express server
│   └── .env                      # Environment variables
│
├── src/
│   ├── components/
│   │   ├── Header.tsx            # Navigation header
│   │   ├── Footer.tsx             # Footer component
│   │   ├── ProductCard.tsx        # Product card
│   │   ├── CartSidebar.tsx       # Shopping cart
│   │   ├── PincodeChecker.tsx    # Delivery checker
│   │   ├── AdminLayout.tsx       # Admin-only layout
│   │   ├── ProtectedRoute.tsx    # Route protection component
│   │   └── ui/                   # Shadcn UI components
│   ├── pages/
│   │   ├── Index.tsx             # Home page
│   │   ├── Products.tsx          # Product listing
│   │   ├── ProductDetails.tsx    # Product details
│   │   ├── Cart.tsx              # Shopping cart
│   │   ├── Checkout.tsx          # Checkout page
│   │   ├── Orders.tsx            # Order history
│   │   ├── CancelledOrders.tsx   # Cancelled orders page
│   │   ├── PaymentSuccess.tsx   # Payment confirmation
│   │   ├── Login.tsx            # Login page
│   │   ├── Signup.tsx           # Registration page
│   │   ├── Admin.tsx            # Admin dashboard
│   │   └── About.tsx            # About page
│   ├── context/
│   │   ├── AuthContext.tsx      # Authentication context
│   │   └── CartContext.tsx      # Cart context
│   ├── services/
│   │   ├── api.ts               # API service (Axios)
│   │   └── pincodeAPI.ts        # Pincode API (Fetch)
│   ├── data/
│   │   ├── products.ts           # Product data
│   │   └── indianStatesCities.ts # Location data
│   └── App.tsx                   # Main app component
│
├── package.json                 # Frontend dependencies
├── backend/package.json         # Backend dependencies
└── README.md                    # This file
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Git
- Razorpay account (for payment integration)

### Step 1: Clone the Repository

```bash
git clone https://github.com/vedant208purohit/shop-hub-208-mern.git
cd shop-hub-208-mern
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env  # Or create manually
```

**Configure `.env` file:**

```env
PORT=5001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shop-hub?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### Step 3: Frontend Setup

```bash
# Navigate back to root directory
cd ..

# Install dependencies
npm install
```

### Step 4: Database Setup

```bash
# Seed the database (optional)
cd backend
node seed.js
```

## 👤 Admin Access

After seeding the database, you can login as admin using:

**Admin Credentials:**

- Email: `admin@shophub.com`
- Password: `admin123`

**Important Admin Features:**

- Admins have a **separate interface** - they cannot access shopping pages
- Admins are **automatically redirected** to `/admin` after login
- Admins **cannot add items to cart** - shopping functionality is disabled
- Admin dashboard shows **accurate revenue** (excludes cancelled orders)
- Only non-cancelled orders with completed payment are counted in revenue

**Regular User Credentials:**

- Email: `user@shophub.com`
- Password: `user123`

## ▶️ Running the Project

### Development Mode

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:5001`

**Terminal 2 - Frontend:**

```bash
npm run dev
```

Frontend will run on `http://localhost:8080`

### Production Mode

**Backend:**

```bash
cd backend
npm start
```

**Frontend:**

```bash
npm run build
npm run preview
```

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint             | Description         | Access  |
| ------ | -------------------- | ------------------- | ------- |
| POST   | `/api/auth/register` | Register new user   | Public  |
| POST   | `/api/auth/login`    | User login          | Public  |
| GET    | `/api/auth/me`       | Get current user    | Private |
| PUT    | `/api/auth/profile`  | Update user profile | Private |

### Product Routes (`/api/products`)

| Method | Endpoint            | Description                     | Access |
| ------ | ------------------- | ------------------------------- | ------ |
| GET    | `/api/products`     | Get all products (with filters) | Public |
| GET    | `/api/products/:id` | Get product by ID               | Public |
| POST   | `/api/products`     | Create new product              | Admin  |
| PUT    | `/api/products/:id` | Update product                  | Admin  |
| PATCH  | `/api/products/:id` | Partially update product        | Admin  |
| DELETE | `/api/products/:id` | Delete product                  | Admin  |

**Query Parameters for GET `/api/products`:**

- `category` - Filter by category
- `search` - Search by name/description
- `sort` - Sort by (name, price-low, price-high, rating)
- `page` - Page number
- `limit` - Items per page

### Order Routes (`/api/orders`)

| Method | Endpoint                 | Description                            | Access  |
| ------ | ------------------------ | -------------------------------------- | ------- |
| POST   | `/api/orders`            | Create new order                       | Private |
| GET    | `/api/orders`            | Get user's orders (excludes cancelled) | Private |
| GET    | `/api/orders/cancelled`  | Get user's cancelled orders            | Private |
| GET    | `/api/orders/:id`        | Get order by ID                        | Private |
| PUT    | `/api/orders/:id/cancel` | Cancel order (one day before delivery) | Private |
| PUT    | `/api/orders/:id/status` | Update order status                    | Admin   |

**Order Cancellation Rules:**

- Can cancel orders one day before estimated delivery date
- Cannot cancel on delivery day or after
- Cannot cancel already cancelled or delivered orders
- Refund processing: 7-10 working days

### Payment Routes (`/api/payments`)

| Method | Endpoint                       | Description                     | Access  |
| ------ | ------------------------------ | ------------------------------- | ------- |
| POST   | `/api/payments/create-order`   | Create Razorpay order           | Private |
| POST   | `/api/payments/verify-payment` | Verify payment and create order | Private |

### Admin Routes (`/api/admin`)

| Method | Endpoint               | Description                                                  | Access |
| ------ | ---------------------- | ------------------------------------------------------------ | ------ |
| GET    | `/api/admin/users`     | Get all users                                                | Admin  |
| PUT    | `/api/admin/users/:id` | Update user                                                  | Admin  |
| DELETE | `/api/admin/users/:id` | Delete user                                                  | Admin  |
| GET    | `/api/admin/stats`     | Get dashboard statistics (revenue excludes cancelled orders) | Admin  |

### Server-Side Rendered Routes

| Method | Endpoint      | Description      |
| ------ | ------------- | ---------------- |
| GET    | `/`           | Home page (EJS)  |
| GET    | `/about`      | About page (EJS) |
| GET    | `/api/health` | Health check     |

## 📚 Third-Party Libraries

### Frontend Libraries

| Library          | Version  | Purpose                     |
| ---------------- | -------- | --------------------------- |
| react            | ^18.3.1  | UI framework                |
| react-router-dom | ^6.26.2  | Client-side routing         |
| axios            | ^1.12.2  | HTTP client for API calls   |
| tailwindcss      | ^3.4.11  | Utility-first CSS framework |
| lucide-react     | ^0.462.0 | Icon library                |
| @radix-ui/\*     | Various  | UI component primitives     |

### Backend Libraries

| Library      | Version | Purpose                       |
| ------------ | ------- | ----------------------------- |
| express      | ^4.18.2 | Web framework                 |
| mongoose     | ^8.0.0  | MongoDB ODM                   |
| jsonwebtoken | ^9.0.2  | JWT authentication            |
| bcryptjs     | ^2.4.3  | Password hashing              |
| razorpay     | ^2.9.6  | Payment gateway               |
| cors         | ^2.8.5  | Cross-origin resource sharing |
| dotenv       | ^16.3.1 | Environment variables         |
| morgan       | ^1.10.0 | HTTP request logger           |
| ejs          | ^3.1.9  | Template engine               |

### Third-Party APIs

1. **Razorpay Payment Gateway**

   - Purpose: Secure payment processing
   - Integration: Backend payment routes
   - Documentation: https://razorpay.com/docs/

2. **India Post Pincode API**
   - Purpose: Validate pincodes and check delivery serviceability
   - Integration: Frontend `pincodeAPI.ts` using fetch API
   - Endpoint: `https://api.postalpincode.in/pincode/{pincode}`

## 🔄 Latest Updates

### Order Management Enhancements

- **Order Cancellation**: Users can cancel orders one day before estimated delivery
- **Cancelled Orders Page**: Separate page to view all cancelled orders with refund information
- **Automatic Status Updates**: Orders automatically change from "pending" to "delivered" when estimated date arrives
- **Estimated Delivery**: All orders show estimated arrival dates (5-7 days from order)
- **System-wide Updates**: Order status updates run automatically for all users

### Checkout Improvements

- **State/City Dropdowns**: All Indian states and cities in dropdown menus
- **Pincode Validation**:
  - Validates pincode format (6 digits, starts with 1-9)
  - Matches pincode with selected city to ensure accuracy
  - Real-time validation with helpful error messages
- **Address Accuracy**: Ensures pincode belongs to selected city before checkout

### Cart Persistence

- Cart items persist across logout/login sessions
- User-specific cart storage in localStorage
- Automatic cart loading on user login

### Admin Dashboard Enhancements

- **Admin-Only Interface**: Separate admin layout without shopping navigation
- **Access Control**: Admins are automatically redirected to admin panel and cannot access shopping pages
- **Cart Restrictions**: Admins cannot add items to cart (restricted at context and component level)
- **Revenue Calculation**:
  - Only counts non-cancelled orders with completed payment
  - Excludes all cancelled orders from revenue
  - Updates only when users successfully complete purchases
- **Dashboard Statistics**:
  - Total users, products, and orders
  - Accurate revenue calculation (₹0 when all orders cancelled)
  - Recent orders with user and product details
- **User Management**: View all users, delete users (except self)
- **Product Management**: Full CRUD operations for products

## 📸 Screenshots

### Main Pages

1. **Home Page** - Hero section, categories, featured products, pincode checker
   ![Home Page](homepage.png)

2. **Products Page** - Product listing with filters and search
   ![Products Page](Products.png)

3. **Product Details** - Product information, image gallery, add to cart
   ![Product Details](productdetails.png)

4. **Shopping Cart** - Cart items with quantity management
   ![Shopping Cart](cart.png)

5. **Checkout Page** - Shipping address form with state/city dropdowns and pincode validation
   ![Checkout Page](checkout.png)

6. **Payment Success** - Order confirmation with details and estimated delivery
   ![Payment Success](payment_success.png)

7. **My Orders** - Order history with estimated delivery dates and cancel functionality
   ![My Orders](orders.png)

8. **Payment** - Payment Interface
   ![Cancelled Orders](payment.png)

9. **Login/Signup** - Authentication pages with welcome messages
   ![Login Signup](login.png)
   ![Login Signup](signup.png)

10. **Admin Dashboard** - Dedicated admin interface with user management, product management, and accurate statistics
    ![Admin Dashboard](admin.png)

11. **POST/auth/login** - API POST/auth/login
    ![Admin Dashboard](post_login.jpeg)

12. **POST/auth/signup** - API POST/auth/signup
    ![Admin Dashboard](post_register.jpeg)

13. **GET/products** - API GET/products
    ![Admin Dashboard](get_products.jpeg)

14. **GET/products/id** - API GET/products/id
    ![Admin Dashboard](get_product_id.jpeg)

## 🔗 GitHub Repository

**Repository Link:** [https://github.com/vedant208purohit/shop-hub-208.git](https://github.com/vedant208purohit/shop-hub-208-mern.git)

### Clone Command:

```bash
git clone https://github.com/vedant208purohit/shop-hub-208.git
```

## 👤 Author

**Vedant Purohit**

**Ayush Shah**

- GitHub: [@vedant208purohit](https://github.com/vedant208purohit)

- GitHub: [@Ayush_shah_12](https://github.com/Ayush_shah_12)

## 🙏 Acknowledgments

- Razorpay for payment gateway integration
- India Post for pincode validation API

---

**Note:** Make sure to configure all environment variables before running the project. For production deployment, update the API URLs and ensure secure handling of sensitive data.
