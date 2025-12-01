
import React from 'react';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import Categories from '../components/Categories';
import PincodeChecker from '../components/PincodeChecker';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PincodeChecker />
      </section>
      <Categories />
      <FeaturedProducts />
    </Layout>
  );
};

export default Index;
