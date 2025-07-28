import { Product } from '../context/CartContext';

export const allProducts: Product[] = [
  // Electronics
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: 24999,
    image: '🎧',
    images: ['🎧', '🎤', '📻', '🎼'],
    category: 'Electronics',
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
    rating: 4.8,
    reviews: 124
  },
  {
    id: 3,
    name: 'Smart Home Speaker',
    price: 12499,
    image: '🔊',
    images: ['🔊', '📢', '📡', '🛰️'],
    category: 'Electronics',
    description: 'Voice-controlled smart speaker with exceptional audio quality and home automation.',
    rating: 4.7,
    reviews: 156
  },
  {
    id: 4,
    name: 'Professional Camera',
    price: 66599,
    image: '📷',
    images: ['📷', '📸', '🎥', '🖼️'],
    category: 'Electronics',
    description: 'Professional-grade camera for capturing life\'s most precious moments in stunning detail.',
    rating: 4.9,
    reviews: 78
  },
  {
    id: 7,
    name: 'Smartphone Pro Max',
    price: 83199,
    image: '📱',
    images: ['📱', '📲', '📳', '📶'],
    category: 'Electronics',
    description: 'Latest flagship smartphone with advanced camera system and lightning-fast performance.',
    rating: 4.8,
    reviews: 245
  },
  {
    id: 8,
    name: 'Wireless Gaming Mouse',
    price: 7499,
    image: '🖱️',
    images: ['🖱️', '🕹️', '🎮', '⌨️'],
    category: 'Electronics',
    description: 'High-precision wireless gaming mouse with customizable RGB lighting and programmable buttons.',
    rating: 4.6,
    reviews: 189
  },
  {
    id: 9,
    name: 'Smart Watch Series X',
    price: 33299,
    image: '⌚',
    images: ['⌚', '⏰', '⏱️', '⏲️'],
    category: 'Electronics',
    description: 'Advanced smartwatch with health monitoring, GPS, and seamless smartphone integration.',
    rating: 4.7,
    reviews: 312
  },
  {
    id: 10,
    name: 'Bluetooth Earbuds Pro',
    price: 14999,
    image: '🎵',
    images: ['🎵', '🎧', '🎶', '🎷'],
    category: 'Electronics',
    description: 'Premium wireless earbuds with active noise cancellation and crystal-clear audio.',
    rating: 4.5,
    reviews: 167
  },
  {
    id: 11,
    name: 'Gaming Laptop Ultra',
    price: 108299,
    image: '💻',
    images: ['💻', '🖥️', '🕹️', '🎮'],
    category: 'Electronics',
    description: 'High-performance gaming laptop with cutting-edge graphics and ultra-fast processing.',
    rating: 4.9,
    reviews: 89
  },
  // Fashion
  {
    id: 2,
    name: 'Designer Leather Jacket',
    price: 16699,
    image: '🧥',
    images: ['🧥', '🧣', '🧤', '👒'],
    category: 'Fashion',
    description: 'Stylish leather jacket crafted from premium materials for the modern trendsetter.',
    rating: 4.6,
    reviews: 89
  },
  {
    id: 12,
    name: 'Classic Denim Jeans',
    price: 6699,
    image: '👖',
    images: ['👖', '👕', '👟', '🧦'],
    category: 'Fashion',
    description: 'Timeless denim jeans with perfect fit and premium cotton blend for ultimate comfort.',
    rating: 4.4,
    reviews: 203
  },
  {
    id: 13,
    name: 'Elegant Summer Dress',
    price: 10899,
    image: '👗',
    images: ['👗', '👚', '👒', '🥿'],
    category: 'Fashion',
    description: 'Beautiful flowing summer dress perfect for any occasion, made from breathable fabric.',
    rating: 4.7,
    reviews: 156
  },
  {
    id: 14,
    name: 'Premium Wool Sweater',
    price: 12499,
    image: '🧶',
    images: ['🧶', '🧵', '🧣', '🧤'],
    category: 'Fashion',
    description: 'Luxurious wool sweater with exceptional warmth and style for the colder months.',
    rating: 4.8,
    reviews: 94
  },
  // Sports
  {
    id: 5,
    name: 'Comfortable Running Shoes',
    price: 10899,
    image: '👟',
    category: 'Sports',
    description: 'Ultra-comfortable running shoes designed for maximum performance and style.',
    rating: 4.5,
    reviews: 203
  },
  {
    id: 15,
    name: 'Professional Tennis Racket',
    price: 16699,
    image: '🎾',
    category: 'Sports',
    description: 'High-quality tennis racket used by professionals, offering excellent control and power.',
    rating: 4.6,
    reviews: 87
  },
  {
    id: 16,
    name: 'Yoga Mat Premium',
    price: 4999,
    image: '🧘',
    category: 'Sports',
    description: 'Non-slip premium yoga mat with excellent cushioning for comfortable practice.',
    rating: 4.7,
    reviews: 234
  },
  // Home & Garden
  {
    id: 6,
    name: 'Modern Coffee Table',
    price: 29199,
    image: '🪑',
    category: 'Home & Garden',
    description: 'Sleek and modern coffee table that complements any contemporary living space.',
    rating: 4.4,
    reviews: 67
  },
  {
    id: 17,
    name: 'Indoor Plant Collection',
    price: 7499,
    image: '🪴',
    category: 'Home & Garden',
    description: 'Beautiful collection of air-purifying indoor plants perfect for home decoration.',
    rating: 4.5,
    reviews: 145
  },
  {
    id: 18,
    name: 'Luxury Bedding Set',
    price: 16699,
    image: '🛏️',
    category: 'Home & Garden',
    description: 'Premium cotton bedding set with soft texture and elegant design for better sleep.',
    rating: 4.8,
    reviews: 198
  },
  // Additional Electronics
  {
    id: 19,
    name: 'Wireless Charging Pad',
    price: 3999,
    image: '🔋',
    category: 'Electronics',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    rating: 4.6,
    reviews: 145
  },
  {
    id: 20,
    name: 'Portable Bluetooth Speaker',
    price: 8999,
    image: '📻',
    category: 'Electronics',
    description: 'Waterproof portable speaker with 20-hour battery life and crystal clear sound.',
    rating: 4.7,
    reviews: 223
  },
  {
    id: 21,
    name: '4K Action Camera',
    price: 24999,
    image: '📹',
    category: 'Electronics',
    description: 'Professional 4K action camera with image stabilization and waterproof case.',
    rating: 4.8,
    reviews: 167
  },
  {
    id: 22,
    name: 'Mechanical Gaming Keyboard',
    price: 12499,
    image: '⌨️',
    category: 'Electronics',
    description: 'RGB mechanical gaming keyboard with customizable switches and macro keys.',
    rating: 4.9,
    reviews: 189
  },
  {
    id: 23,
    name: 'Smart LED Strip Lights',
    price: 5999,
    image: '💡',
    category: 'Electronics',
    description: 'WiFi-enabled LED strip lights with voice control and 16 million colors.',
    rating: 4.5,
    reviews: 312
  },
  {
    id: 24,
    name: 'Wireless Earbuds Sport',
    price: 11999,
    image: '🎧',
    category: 'Electronics',
    description: 'Sweat-resistant wireless earbuds perfect for workouts and sports activities.',
    rating: 4.6,
    reviews: 198
  },
  // Additional Fashion
  {
    id: 25,
    name: 'Classic White Sneakers',
    price: 8999,
    image: '👟',
    category: 'Fashion',
    description: 'Timeless white sneakers with premium leather construction and comfort sole.',
    rating: 4.7,
    reviews: 267
  },
  {
    id: 26,
    name: 'Designer Handbag',
    price: 24999,
    image: '👜',
    category: 'Fashion',
    description: 'Luxury designer handbag crafted from genuine leather with gold hardware.',
    rating: 4.9,
    reviews: 89
  },
  {
    id: 27,
    name: 'Silk Scarf Collection',
    price: 4999,
    image: '🧣',
    category: 'Fashion',
    description: 'Premium silk scarves with elegant patterns perfect for any occasion.',
    rating: 4.8,
    reviews: 156
  },
  {
    id: 28,
    name: 'Formal Business Suit',
    price: 33299,
    image: '👔',
    category: 'Fashion',
    description: 'Professional business suit with tailored fit and premium wool blend fabric.',
    rating: 4.9,
    reviews: 78
  },
  {
    id: 29,
    name: 'Casual Hoodie',
    price: 7499,
    image: '🧥',
    category: 'Fashion',
    description: 'Comfortable cotton hoodie with modern design and soft fleece lining.',
    rating: 4.6,
    reviews: 234
  },
  {
    id: 30,
    name: 'Elegant Pearl Necklace',
    price: 18999,
    image: '💎',
    category: 'Fashion',
    description: 'Stunning pearl necklace with 18k gold clasp, perfect for special occasions.',
    rating: 4.9,
    reviews: 67
  },
  // Additional Sports
  {
    id: 31,
    name: 'Professional Basketball',
    price: 8999,
    image: '🏀',
    category: 'Sports',
    description: 'Official size basketball with premium grip and durability for indoor/outdoor use.',
    rating: 4.7,
    reviews: 145
  },
  {
    id: 32,
    name: 'Cycling Helmet',
    price: 5999,
    image: '⛑️',
    category: 'Sports',
    description: 'Lightweight cycling helmet with advanced safety features and ventilation.',
    rating: 4.8,
    reviews: 189
  },
  {
    id: 33,
    name: 'Fitness Tracker Pro',
    price: 14999,
    image: '⌚',
    category: 'Sports',
    description: 'Advanced fitness tracker with heart rate monitoring and GPS tracking.',
    rating: 4.6,
    reviews: 223
  },
  {
    id: 34,
    name: 'Resistance Bands Set',
    price: 2999,
    image: '🏋️',
    category: 'Sports',
    description: 'Complete set of resistance bands for home workouts and strength training.',
    rating: 4.5,
    reviews: 178
  },
  {
    id: 35,
    name: 'Swimming Goggles',
    price: 3999,
    image: '🥽',
    category: 'Sports',
    description: 'Anti-fog swimming goggles with UV protection and comfortable fit.',
    rating: 4.7,
    reviews: 134
  },
  {
    id: 36,
    name: 'Hiking Boots',
    price: 12499,
    image: '🥾',
    category: 'Sports',
    description: 'Waterproof hiking boots with superior traction and ankle support.',
    rating: 4.8,
    reviews: 167
  },
  // Additional Home & Garden
  {
    id: 37,
    name: 'Smart Coffee Maker',
    price: 19999,
    image: '☕',
    category: 'Home & Garden',
    description: 'WiFi-enabled coffee maker with programmable brewing and smartphone control.',
    rating: 4.7,
    reviews: 145
  },
  {
    id: 38,
    name: 'Aromatherapy Diffuser',
    price: 4999,
    image: '🕯️',
    category: 'Home & Garden',
    description: 'Ultrasonic essential oil diffuser with LED mood lighting and timer.',
    rating: 4.6,
    reviews: 198
  },
  {
    id: 39,
    name: 'Kitchen Knife Set',
    price: 8999,
    image: '🔪',
    category: 'Home & Garden',
    description: 'Professional kitchen knife set with wooden block and sharpening steel.',
    rating: 4.9,
    reviews: 123
  },
  {
    id: 40,
    name: 'Wall Art Canvas',
    price: 7499,
    image: '🖼️',
    category: 'Home & Garden',
    description: 'Beautiful canvas wall art with modern abstract design and gallery wrap.',
    rating: 4.5,
    reviews: 89
  },
  {
    id: 41,
    name: 'Smart Thermostat',
    price: 14999,
    image: '🌡️',
    category: 'Home & Garden',
    description: 'WiFi smart thermostat with energy saving features and mobile app control.',
    rating: 4.8,
    reviews: 167
  },
  {
    id: 42,
    name: 'Garden Tool Set',
    price: 5999,
    image: '🌱',
    category: 'Home & Garden',
    description: 'Complete garden tool set with ergonomic handles and durable construction.',
    rating: 4.7,
    reviews: 145
  },
  // Books & Media
  {
    id: 43,
    name: 'Bestselling Novel Collection',
    price: 3999,
    image: '📚',
    category: 'Books & Media',
    description: 'Collection of bestselling novels in hardcover with beautiful covers.',
    rating: 4.8,
    reviews: 234
  },
  {
    id: 44,
    name: 'Wireless Gaming Headset',
    price: 9999,
    image: '🎮',
    category: 'Books & Media',
    description: '7.1 surround sound gaming headset with noise-canceling microphone.',
    rating: 4.7,
    reviews: 189
  },
  {
    id: 45,
    name: 'Bluetooth Turntable',
    price: 19999,
    image: '💿',
    category: 'Books & Media',
    description: 'Modern Bluetooth turntable with built-in speakers and USB recording.',
    rating: 4.9,
    reviews: 78
  },
  {
    id: 46,
    name: 'Educational Board Game',
    price: 2999,
    image: '🎲',
    category: 'Books & Media',
    description: 'Family-friendly educational board game that promotes learning and fun.',
    rating: 4.6,
    reviews: 156
  },
  {
    id: 47,
    name: 'Puzzle Collection',
    price: 1999,
    image: '🧩',
    category: 'Books & Media',
    description: 'Assorted puzzle collection with varying difficulty levels for all ages.',
    rating: 4.5,
    reviews: 123
  },
  {
    id: 48,
    name: 'Digital Drawing Tablet',
    price: 24999,
    image: '✏️',
    category: 'Books & Media',
    description: 'Professional drawing tablet with pressure sensitivity and wireless connectivity.',
    rating: 4.8,
    reviews: 134
  },
  {
    id: 49,
    name: 'Smartphone Gimbal',
    price: 8999,
    image: '📱',
    category: 'Books & Media',
    description: '3-axis smartphone gimbal for smooth video recording and photography.',
    rating: 4.7,
    reviews: 167
  },
  {
    id: 50,
    name: 'Wireless Presenter',
    price: 3999,
    image: '🖱️',
    category: 'Books & Media',
    description: 'Professional wireless presenter with laser pointer and media controls.',
    rating: 4.6,
    reviews: 98
  }
]; 