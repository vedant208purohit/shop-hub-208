
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import { Product } from '../context/CartContext';

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const featuredProducts: Product[] = [
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      price: 24999,
      image: '🎧',
      category: 'Electronics',
      description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
      rating: 4.8,
      reviews: 124
    },
    {
      id: 2,
      name: 'Designer Leather Jacket',
      price: 16699,
      image: '🧥',
      category: 'Fashion',
      description: 'Stylish leather jacket crafted from premium materials for the modern trendsetter.',
      rating: 4.6,
      reviews: 89
    },
    {
      id: 3,
      name: 'Smart Home Speaker',
      price: 12499,
      image: '🔊',
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
      category: 'Electronics',
      description: 'Professional-grade camera for capturing life\'s most precious moments in stunning detail.',
      rating: 4.9,
      reviews: 78
    },
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
      id: 6,
      name: 'Modern Coffee Table',
      price: 29199,
      image: '🪑',
      category: 'Home & Garden',
      description: 'Sleek and modern coffee table that complements any contemporary living space.',
      rating: 4.4,
      reviews: 67
    }
  ];

  return (
    <section id="products" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our hand-picked selection of premium products that our customers love most
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button 
            onClick={() => navigate('/products')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
