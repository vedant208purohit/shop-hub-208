import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import { Product, useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import Layout from '../components/Layout';
import { allProducts } from '../data/products';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, formatPrice, getCartItemsCount } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);

  const product = allProducts.find(p => p.id === parseInt(id || '0'));

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Products
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your cart",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    // Add the product multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    
    // Show success message with quantity
    toast({
      title: "Added to Cart!",
      description: `${quantity} ${quantity === 1 ? 'item' : 'items'} of ${product.name} added to your cart`,
    });
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleLike = () => {
    setLiked((prev) => !prev);
    toast({
      title: liked ? 'Removed from Likes' : 'Added to Likes',
      description: liked
        ? `You unliked ${product.name}`
        : `You liked ${product.name}`,
    });
  };

  // Use product images array or fallback to single image
  const productImages = product.images || [product.image, product.image, product.image, product.image];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <span>/</span>
          <button
            onClick={() => navigate('/products')}
            className="hover:text-blue-600 transition-colors"
          >
            Products
          </button>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center text-8xl relative overflow-hidden">
              {productImages[selectedImage]}
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-2xl transition-all ${
                    selectedImage === index 
                      ? 'ring-2 ring-blue-600 scale-105' 
                      : 'hover:scale-105'
                  }`}
                >
                  {image}
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div className="flex items-center gap-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {product.category}
              </span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-2">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

            {/* Price */}
            <div className="text-3xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                    disabled={quantity >= 10}
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500">Max: 10</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart ({quantity})
              </button>
              <button
                onClick={handleLike}
                className={`p-4 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors ${liked ? 'bg-red-50 border-red-400' : ''}`}
                aria-label={liked ? 'Unlike' : 'Like'}
              >
                <Heart className={`h-5 w-5 ${liked ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} fill={liked ? 'currentColor' : 'none'} />
              </button>
              <button className="p-4 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                <Share2 className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            
            {/* View Cart Button */}
            <div className="flex justify-center">
              <button
                onClick={() => navigate('/cart')}
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
                View Cart ({getCartItemsCount()} items)
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-semibold text-sm">Free Shipping</p>
                  <p className="text-xs text-gray-500">On orders over ₹999</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-sm">Secure Payment</p>
                  <p className="text-xs text-gray-500">100% secure checkout</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-semibold text-sm">Easy Returns</p>
                  <p className="text-xs text-gray-500">30 day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails; 