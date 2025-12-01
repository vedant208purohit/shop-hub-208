import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Layout from '../components/Layout';
import { Product } from '../context/CartContext';
import { Search, Filter } from 'lucide-react';
import { allProducts } from '../data/products';
import { productsAPI } from '../services/api';

const Products = () => {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  const searchFromUrl = searchParams.get('search');
  
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFromUrl || 'All');
  const [searchTerm, setSearchTerm] = useState(searchFromUrl || '');
  const [sortBy, setSortBy] = useState('name');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, [categoryFromUrl, searchFromUrl]);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getAll({
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          search: searchTerm || undefined,
          sort: sortBy,
        });
        setProducts(response.data.products);
      } catch (error) {
        console.error('Failed to fetch products from API, using local data:', error);
        // Fallback to local products
        setProducts(allProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchTerm, sortBy]);

  const categories = ['All', 'Electronics', 'Fashion', 'Sports', 'Home & Garden', 'Books & Media'];

  const filteredProducts = useMemo(() => {
    return products;
  }, [products]);

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {selectedCategory === 'All' ? 'All Products' : selectedCategory}
          </h1>
          <p className="text-xl text-gray-600">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Products;
