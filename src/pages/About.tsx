import React from 'react';
import { Award, Users, Target, Heart } from 'lucide-react';
import Layout from '../components/Layout';

const About = () => {
  const values = [
    {
      icon: <Award className="h-8 w-8" />,
      title: "Quality First",
      description: "We source only the finest products from trusted manufacturers worldwide."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Customer Focus", 
      description: "Your satisfaction is our priority. We're here to serve you better every day."
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Innovation",
      description: "We constantly evolve to bring you the latest trends and technologies."
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Passion",
      description: "We love what we do and it shows in every product we offer."
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">ShopHub</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Founded in 2020, ShopHub has been revolutionizing the online shopping experience by connecting customers with premium products from around the world.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  ShopHub began as a simple idea: to create a marketplace where quality meets convenience. 
                  Our founders, passionate about both technology and customer service, saw an opportunity 
                  to bridge the gap between premium products and accessible online shopping.
                </p>
                <p>
                  Today, we serve thousands of customers worldwide, offering everything from cutting-edge 
                  electronics to fashion-forward apparel, all curated with the same attention to quality 
                  that started our journey.
                </p>
                <p>
                  We believe that shopping should be more than just transactional – it should be an 
                  experience that delights, inspires, and connects people with products they truly love.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 flex items-center justify-center">
              <div className="text-9xl">🏢</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-blue-600 mb-4 flex justify-center">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">The people behind ShopHub's success</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Priya Sharma", role: "CEO & Founder", emoji: "👩‍💼" },
              { name: "Arjun Patel", role: "CTO", emoji: "👨‍💻" },
              { name: "Anjali Singh", role: "Head of Marketing", emoji: "👩‍🎨" }
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-6xl mx-auto mb-4">
                  {member.emoji}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
