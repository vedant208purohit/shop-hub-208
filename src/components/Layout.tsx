
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { CartProvider } from '../context/CartContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          {children}
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
};

export default Layout;
