const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const { updateOrderStatuses } = require('./utils/orderStatusUpdater');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(morgan('dev')); // HTTP request logger
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/admin', require('./routes/admin'));

// EJS Server-side rendered routes
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'Shop Hub - Welcome',
    message: 'Welcome to Shop Hub E-Commerce Platform'
  });
});

app.get('/about', (req, res) => {
  res.render('about', { 
    title: 'About Us - Shop Hub',
    companyName: 'Shop Hub',
    description: 'Your trusted online shopping destination'
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);

  // Update order statuses on server startup
  setTimeout(async () => {
    await updateOrderStatuses();
  }, 5000); 
});

// Update order statuses every hour for all users and all orders
setInterval(async () => {
  await updateOrderStatuses();
}, 60 * 60 * 1000); // Run every hour (60 minutes * 60 seconds * 1000 milliseconds)
