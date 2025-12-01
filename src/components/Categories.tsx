
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: 1,
      name: 'Electronics',
      image: '📱',
      count: '150+ Products',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 2,
      name: 'Fashion',
      image: '👕',
      count: '200+ Products',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 3,
      name: 'Home & Garden',
      image: '🏠',
      count: '120+ Products',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 4,
      name: 'Sports',
      image: '⚽',
      count: '80+ Products',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section id="categories" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find exactly what you're looking for in our carefully organized categories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
            >
              <div className={`bg-gradient-to-br ${category.color} p-8 rounded-2xl text-white text-center shadow-lg hover:shadow-xl transition-shadow duration-300`}>
                <div className="text-6xl mb-4">{category.image}</div>
                <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                <p className="text-white/80">{category.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
