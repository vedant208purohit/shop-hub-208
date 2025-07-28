
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Hero = () => {
  const { user } = useAuth();
  
  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              {user ? (
                <>
                  Welcome back, {user.name}! 👋
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                    Ready to Shop?
                  </span>
                </>
              ) : (
                <>
                  Discover Your
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                    Perfect Style
                  </span>
                </>
              )}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {user 
                ? `Explore our curated collection of premium products, ${user.name}. Quality meets innovation in every piece.`
                : 'Explore our curated collection of premium products designed to elevate your lifestyle. Quality meets innovation in every piece.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Shop Now
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/about"
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300 text-center"
              >
                Learn More
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-blue-200 to-purple-200 rounded-3xl flex items-center justify-center">
              <div className="text-8xl">🛍️</div>
            </div>
            <div className="absolute -top-4 -right-4 bg-orange-500 text-white px-4 py-2 rounded-full font-semibold text-sm">
              New Collection
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
