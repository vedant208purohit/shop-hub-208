import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Package, MapPin, CreditCard, Calendar, ArrowRight } from 'lucide-react';
import Layout from '../components/Layout';
import { ordersAPI } from '../services/api';
import { useToast } from '../hooks/use-toast';

interface OrderData {
  order: {
    _id: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
    };
    totalAmount: number;
    paymentStatus: string;
    orderStatus: string;
    orderDate: string;
    estimatedArrivalDate?: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
  };
}

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get order data from location state or fetch from API
    const stateOrderData = location.state?.orderData;
    
    if (stateOrderData) {
      setOrderData(stateOrderData);
      setLoading(false);
    } else {
      // If no state, try to get order ID from URL params or fetch latest order
      const orderId = new URLSearchParams(location.search).get('orderId');
      if (orderId) {
        fetchOrder(orderId);
      } else {
        // Fetch the most recent order
        fetchLatestOrder();
      }
    }
  }, [location]);

  const fetchOrder = async (orderId: string) => {
    try {
      const response = await ordersAPI.getById(orderId);
      setOrderData({ order: response.data });
      setLoading(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch order details",
        variant: "destructive",
      });
      navigate('/orders');
    }
  };

  const fetchLatestOrder = async () => {
    try {
      const response = await ordersAPI.getAll();
      const orders = response.data;
      if (orders && orders.length > 0) {
        // Get the most recent order
        const latestOrder = orders[0];
        setOrderData({ order: latestOrder });
      }
      setLoading(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch order details",
        variant: "destructive",
      });
      navigate('/orders');
    }
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!orderData || !orderData.order) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
            <button
              onClick={() => navigate('/orders')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Orders
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const { order } = orderData;
  const tax = order.totalAmount * 0.18 / 1.18; // Calculate tax (18% GST included)
  const subtotal = order.totalAmount - tax;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-4">
              Thank you for your purchase. Your order has been confirmed.
            </p>
            <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
              Order ID: {order._id.slice(-8).toUpperCase()}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Package className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Order Items</h2>
                </div>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-4 border-b last:border-0">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatPrice(item.price)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Shipping Address</h2>
                </div>
                <div className="text-gray-700 space-y-1">
                  <p className="font-medium">{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Payment Information</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-semibold text-gray-900">Razorpay</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status</span>
                    <span className="font-semibold text-green-600 capitalize">
                      {order.paymentStatus}
                    </span>
                  </div>
                  {order.razorpayPaymentId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID</span>
                      <span className="font-mono text-sm text-gray-700">
                        {order.razorpayPaymentId.slice(-12)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (GST 18%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>{formatPrice(order.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-6 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Order Date</span>
                    <span className="text-gray-900 font-medium">
                      {formatDate(order.orderDate)}
                    </span>
                  </div>
                  {order.estimatedArrivalDate && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="text-gray-600">Estimated Arrival</span>
                      </div>
                      <span className="text-blue-600 font-semibold">
                        {new Date(order.estimatedArrivalDate).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Order Status</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold capitalize">
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => navigate('/orders')}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    View All Orders
                    <ArrowRight className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => navigate('/products')}
                    className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:border-blue-500 hover:text-blue-500 transition-all duration-300"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentSuccess;


