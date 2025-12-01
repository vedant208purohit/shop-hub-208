import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "./AuthContext";

export interface Product {
  _id: string; // <-- CHANGED from number
  stock: number;
  name: string;
  price: number;
  image: string;
  images: string[];
  category: string;
  description: string;
  rating: number;
  reviews: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void; // <-- CHANGED from number
  updateQuantity: (productId: string, quantity: number) => void; // <-- CHANGED from number
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  formatPrice: (price: number) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const isInitialLoad = useRef(true);
  const previousUserId = useRef<string | null>(null);

  // Load cart from localStorage when user logs in
  useEffect(() => {
    if (user && user._id) {
      // Check if this is a new user login (different user ID)
      if (previousUserId.current !== user._id) {
        isInitialLoad.current = true;
        previousUserId.current = user._id;
        
        const savedCart = localStorage.getItem(`cart_${user._id}`);
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            if (Array.isArray(parsedCart) && parsedCart.length > 0) {
              setCart(parsedCart);
            } else {
              setCart([]);
            }
          } catch (error) {
            console.error('Error loading cart from localStorage:', error);
            setCart([]);
          }
        } else {
          setCart([]);
        }
        
        // Mark initial load as complete after a short delay
        setTimeout(() => {
          isInitialLoad.current = false;
        }, 100);
      }
    } else {
      // User logged out - clear cart state but don't save (preserves localStorage)
      previousUserId.current = null;
      isInitialLoad.current = true;
      setCart([]);
    }
  }, [user?._id]);

  // Save cart to localStorage whenever cart changes and user is logged in
  // Skip saving during initial load to prevent overwriting
  useEffect(() => {
    if (user && user._id && !isInitialLoad.current) {
      localStorage.setItem(`cart_${user._id}`, JSON.stringify(cart));
    }
  }, [cart, user?._id]);

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString("en-IN")}`;
  };

  const addToCart = (product: Product) => {
    // Prevent admins from adding to cart
    if (user && user.role === 'admin') {
      toast({
        title: "Admin Access",
        description: "Admins cannot add items to cart. Please use the admin panel to manage products.",
        variant: "destructive",
      });
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id); // <-- CHANGED from .id
      if (existingItem) {
        toast({
          title: "Item updated",
          description: `Quantity of ${product.name} increased in cart`,
        });
        return prevCart.map((item) =>
          item._id === product._id // <-- CHANGED from .id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      });
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    // <-- CHANGED from number
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId)); // <-- CHANGED from .id
  };

  const updateQuantity = (productId: string, quantity: number) => {
    // <-- CHANGED from number
    if (quantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map(
        (item) => (item._id === productId ? { ...item, quantity } : item) // <-- CHANGED from .id
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    // Also clear from localStorage
    if (user) {
      localStorage.removeItem(`cart_${user._id}`);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
        formatPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
