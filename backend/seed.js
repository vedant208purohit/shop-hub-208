const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const products = [
  // Electronics
  { name: 'Premium Wireless Headphones', price: 24999, image: '🎧', images: ['🎧', '🎤', '📻', '🎼'], category: 'Electronics', description: 'High-quality wireless headphones with noise cancellation and premium sound quality.', rating: 4.8, reviews: 124, stock: 50 },
  { name: 'Smart Home Speaker', price: 12499, image: '🔊', images: ['🔊', '📢', '📡', '🛰️'], category: 'Electronics', description: 'Voice-controlled smart speaker with exceptional audio quality.', rating: 4.7, reviews: 156, stock: 45 },
  { name: 'Professional Camera', price: 66599, image: '📷', images: ['📷', '📸', '🎥', '🖼️'], category: 'Electronics', description: 'Professional-grade camera for stunning photography.', rating: 4.9, reviews: 78, stock: 15 },
  { name: 'Smartphone Pro Max', price: 83199, image: '📱', images: ['📱', '📲', '📳', '📶'], category: 'Electronics', description: 'Latest flagship smartphone with advanced camera system.', rating: 4.8, reviews: 245, stock: 60 },
  { name: 'Laptop Ultra', price: 99999, image: '💻', images: ['💻', '⌨️', '🖱️', '🖥️'], category: 'Electronics', description: 'High-performance laptop for professionals.', rating: 4.9, reviews: 167, stock: 35 },
  { name: 'Tablet Pro', price: 45999, image: '📱', images: ['📱', '🖊️', '📝', '🎨'], category: 'Electronics', description: 'Powerful tablet with stylus support.', rating: 4.7, reviews: 98, stock: 40 },
  { name: 'Smartwatch', price: 18999, image: '⌚', images: ['⌚', '📱', '💪', '❤️'], category: 'Electronics', description: 'Feature-packed smartwatch with health tracking.', rating: 4.6, reviews: 189, stock: 70 },
  { name: 'Wireless Earbuds', price: 8999, image: '🎵', images: ['🎵', '🎧', '📱', '🔋'], category: 'Electronics', description: 'Compact wireless earbuds with great sound.', rating: 4.5, reviews: 312, stock: 100 },
  { name: 'Gaming Console', price: 49999, image: '🎮', images: ['🎮', '🕹️', '👾', '🎯'], category: 'Electronics', description: 'Next-gen gaming console for ultimate gaming.', rating: 4.9, reviews: 456, stock: 25 },
  { name: 'Smart TV 55"', price: 54999, image: '📺', images: ['📺', '🎬', '🎥', '🍿'], category: 'Electronics', description: '4K Smart TV with stunning picture quality.', rating: 4.8, reviews: 234, stock: 30 },
  
  // Fashion
  { name: 'Designer Leather Jacket', price: 16699, image: '🧥', images: ['🧥', '🧣', '🧤', '👒'], category: 'Fashion', description: 'Stylish leather jacket crafted from premium materials.', rating: 4.6, reviews: 89, stock: 30 },
  { name: 'Casual T-Shirt', price: 1299, image: '👕', images: ['👕', '👔', '🎽', '🧢'], category: 'Fashion', description: 'Comfortable cotton t-shirt for everyday wear.', rating: 4.4, reviews: 456, stock: 200 },
  { name: 'Denim Jeans', price: 2999, image: '👖', images: ['👖', '👗', '👘', '🥼'], category: 'Fashion', description: 'Classic denim jeans with perfect fit.', rating: 4.5, reviews: 234, stock: 150 },
  { name: 'Formal Shirt', price: 1999, image: '👔', images: ['👔', '👕', '🎩', '🥾'], category: 'Fashion', description: 'Elegant formal shirt for professional look.', rating: 4.6, reviews: 123, stock: 100 },
  { name: 'Summer Dress', price: 3499, image: '👗', images: ['👗', '👠', '👜', '💄'], category: 'Fashion', description: 'Light and breezy summer dress.', rating: 4.7, reviews: 178, stock: 80 },
  { name: 'Winter Coat', price: 8999, image: '🧥', images: ['🧥', '🧣', '🧤', '🎿'], category: 'Fashion', description: 'Warm winter coat for cold weather.', rating: 4.8, reviews: 145, stock: 60 },
  { name: 'Sneakers', price: 4999, image: '👟', images: ['👟', '🥾', '👞', '🏃'], category: 'Fashion', description: 'Trendy sneakers for casual style.', rating: 4.6, reviews: 267, stock: 120 },
  { name: 'Formal Shoes', price: 5999, image: '👞', images: ['👞', '👠', '🥿', '👢'], category: 'Fashion', description: 'Classic formal shoes for office.', rating: 4.5, reviews: 156, stock: 90 },
  { name: 'Handbag', price: 6999, image: '👜', images: ['👜', '🎒', '💼', '👝'], category: 'Fashion', description: 'Stylish handbag with spacious storage.', rating: 4.7, reviews: 198, stock: 70 },
  { name: 'Sunglasses', price: 2499, image: '🕶️', images: ['🕶️', '👓', '🥽', '😎'], category: 'Fashion', description: 'UV protection sunglasses with style.', rating: 4.4, reviews: 289, stock: 150 },
  
  // Sports
  { name: 'Comfortable Running Shoes', price: 10899, image: '👟', images: ['👟', '🥾', '👞', '🏃'], category: 'Sports', description: 'Ultra-comfortable running shoes for performance.', rating: 4.5, reviews: 203, stock: 100 },
  { name: 'Yoga Mat Premium', price: 4999, image: '🧘', images: ['🧘', '🏋️', '🤸', '🧘‍♀️'], category: 'Sports', description: 'Non-slip premium yoga mat with cushioning.', rating: 4.7, reviews: 234, stock: 80 },
  { name: 'Gym Dumbbells Set', price: 7999, image: '🏋️', images: ['🏋️', '💪', '🤸', '🏃'], category: 'Sports', description: 'Adjustable dumbbells for home workout.', rating: 4.6, reviews: 145, stock: 50 },
  { name: 'Bicycle Mountain', price: 25999, image: '🚴', images: ['🚴', '🚵', '🏔️', '⛰️'], category: 'Sports', description: 'Durable mountain bike for adventures.', rating: 4.8, reviews: 167, stock: 30 },
  { name: 'Tennis Racket', price: 8999, image: '🎾', images: ['🎾', '🏸', '🏓', '⚾'], category: 'Sports', description: 'Professional tennis racket for players.', rating: 4.7, reviews: 89, stock: 45 },
  { name: 'Football', price: 1999, image: '⚽', images: ['⚽', '🏀', '🏈', '🥎'], category: 'Sports', description: 'High-quality football for matches.', rating: 4.5, reviews: 234, stock: 100 },
  { name: 'Cricket Bat', price: 5999, image: '🏏', images: ['🏏', '🥎', '⚾', '🎾'], category: 'Sports', description: 'Professional cricket bat for players.', rating: 4.6, reviews: 178, stock: 60 },
  { name: 'Swimming Goggles', price: 1499, image: '🥽', images: ['🥽', '🏊', '🤿', '🏖️'], category: 'Sports', description: 'Anti-fog swimming goggles.', rating: 4.4, reviews: 267, stock: 120 },
  { name: 'Sports Watch', price: 12999, image: '⌚', images: ['⌚', '🏃', '💪', '📊'], category: 'Sports', description: 'GPS sports watch with activity tracking.', rating: 4.7, reviews: 156, stock: 55 },
  { name: 'Protein Shaker', price: 899, image: '🥤', images: ['🥤', '💪', '🏋️', '🥛'], category: 'Sports', description: 'Leak-proof protein shaker bottle.', rating: 4.3, reviews: 345, stock: 200 },
  
  // Home & Garden
  { name: 'Modern Coffee Table', price: 29199, image: '🪑', images: ['🪑', '🛋️', '🪟', '🏠'], category: 'Home & Garden', description: 'Sleek modern coffee table for living room.', rating: 4.4, reviews: 67, stock: 25 },
  { name: 'Sofa 3-Seater', price: 45999, image: '🛋️', images: ['🛋️', '🪑', '🏠', '🛏️'], category: 'Home & Garden', description: 'Comfortable 3-seater sofa.', rating: 4.7, reviews: 89, stock: 20 },
  { name: 'Bed King Size', price: 54999, image: '🛏️', images: ['🛏️', '🛋️', '🪑', '🏠'], category: 'Home & Garden', description: 'Luxurious king size bed frame.', rating: 4.8, reviews: 78, stock: 15 },
  { name: 'Dining Table Set', price: 39999, image: '🍽️', images: ['🍽️', '🪑', '🍴', '🏠'], category: 'Home & Garden', description: '6-seater dining table with chairs.', rating: 4.6, reviews: 56, stock: 18 },
  { name: 'Office Chair', price: 15999, image: '🪑', images: ['🪑', '💼', '🖥️', '📝'], category: 'Home & Garden', description: 'Ergonomic office chair with lumbar support.', rating: 4.7, reviews: 234, stock: 45 },
  { name: 'Bookshelf', price: 12999, image: '📚', images: ['📚', '📖', '🏠', '🪑'], category: 'Home & Garden', description: 'Wooden bookshelf with 5 shelves.', rating: 4.5, reviews: 123, stock: 35 },
  { name: 'Table Lamp', price: 2999, image: '💡', images: ['💡', '🕯️', '🏠', '🛏️'], category: 'Home & Garden', description: 'Modern table lamp with LED bulb.', rating: 4.4, reviews: 178, stock: 80 },
  { name: 'Wall Clock', price: 1999, image: '🕐', images: ['🕐', '🏠', '🪑', '🖼️'], category: 'Home & Garden', description: 'Stylish wall clock for home.', rating: 4.3, reviews: 267, stock: 100 },
  { name: 'Plant Pot Set', price: 1499, image: '🪴', images: ['🪴', '🌱', '🌿', '🏠'], category: 'Home & Garden', description: 'Ceramic plant pots set of 3.', rating: 4.6, reviews: 345, stock: 120 },
  { name: 'Curtains', price: 3999, image: '🪟', images: ['🪟', '🏠', '🛏️', '🛋️'], category: 'Home & Garden', description: 'Premium curtains for windows.', rating: 4.5, reviews: 156, stock: 70 },
  
  // Books & Media
  { name: 'Bestseller Novel', price: 499, image: '📚', images: ['📚', '📖', '📝', '✍️'], category: 'Books & Media', description: 'Popular fiction bestseller book.', rating: 4.8, reviews: 567, stock: 200 },
  { name: 'Cookbook Deluxe', price: 799, image: '📖', images: ['📖', '🍳', '🥘', '👨‍🍳'], category: 'Books & Media', description: 'Complete cookbook with 500 recipes.', rating: 4.7, reviews: 234, stock: 150 },
  { name: 'Art Book', price: 1299, image: '🎨', images: ['🎨', '🖼️', '📚', '✨'], category: 'Books & Media', description: 'Beautiful art collection book.', rating: 4.6, reviews: 89, stock: 80 },
  { name: 'Music Album CD', price: 399, image: '💿', images: ['💿', '🎵', '🎶', '🎤'], category: 'Books & Media', description: 'Latest music album on CD.', rating: 4.5, reviews: 345, stock: 100 },
  { name: 'Board Game', price: 2999, image: '🎲', images: ['🎲', '🎯', '🃏', '🎮'], category: 'Books & Media', description: 'Fun family board game.', rating: 4.7, reviews: 234, stock: 60 },
  { name: 'Puzzle 1000 Pieces', price: 1499, image: '🧩', images: ['🧩', '🎨', '🖼️', '🏠'], category: 'Books & Media', description: 'Challenging jigsaw puzzle.', rating: 4.4, reviews: 178, stock: 90 },
  { name: 'Educational Toy', price: 1999, image: '🧸', images: ['🧸', '🎓', '📚', '👶'], category: 'Books & Media', description: 'Learning toy for kids.', rating: 4.6, reviews: 267, stock: 110 },
  { name: 'Movie Collection DVD', price: 1999, image: '🎬', images: ['🎬', '🎥', '🍿', '📀'], category: 'Books & Media', description: 'Classic movies DVD box set.', rating: 4.7, reviews: 156, stock: 70 },
  { name: 'Comic Book Set', price: 1299, image: '📔', images: ['📔', '📚', '🦸', '💥'], category: 'Books & Media', description: 'Popular comic book collection.', rating: 4.8, reviews: 289, stock: 85 },
  { name: 'Magazine Subscription', price: 599, image: '📰', images: ['📰', '📖', '📝', '📅'], category: 'Books & Media', description: 'Monthly magazine subscription.', rating: 4.5, reviews: 198, stock: 999 }
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data cleared!');

    // Insert products
    await Product.insertMany(products);
    console.log('Products seeded!');

    // Create admin user
    await User.create({
      name: 'Admin User',
      email: 'admin@shophub.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 9876543210',
      address: {
        street: '123 MG Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      }
    });

    // Create test user
    await User.create({
      name: 'Test User',
      email: 'user@shophub.com',
      password: 'user123',
      role: 'user',
      phone: '+91 9876543211',
      address: {
        street: '456 Park Street',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        country: 'India'
      }
    });

    console.log('Users seeded!');
    console.log('\nLogin Credentials:');
    console.log('Admin: admin@shophub.com / admin123');
    console.log('User: user@shophub.com / user123');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
