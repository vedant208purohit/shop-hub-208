
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import Orders from "./pages/Orders";
import CancelledOrders from "./pages/CancelledOrders";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes - accessible to everyone except admins */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Protected shopping routes - blocked for admins */}
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
              <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
              <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
              <Route path="/products/:category" element={<ProtectedRoute><Products /></ProtectedRoute>} />
              <Route path="/product/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
              <Route path="/cart" element={<ProtectedRoute requireAuth><Cart /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute requireAuth><Checkout /></ProtectedRoute>} />
              <Route path="/payment-success" element={<ProtectedRoute requireAuth><PaymentSuccess /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute requireAuth><Orders /></ProtectedRoute>} />
              <Route path="/cancelled-orders" element={<ProtectedRoute requireAuth><CancelledOrders /></ProtectedRoute>} />
              
              {/* Admin route - only accessible to admins */}
              <Route path="/admin" element={<Admin />} />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
