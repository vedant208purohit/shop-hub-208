import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Truck, CheckCircle, XCircle, Clock, MapPin, CreditCard, Eye, Calendar, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import { useCart } from '../context/CartContext';
import Layout from '../components/Layout';
import { ordersAPI } from '../services/api';

interface Order {
  _id: string;
  items: Array<{
    product?: { name: string; image: string };
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  orderDate: string;
  estimatedArrivalDate?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { formatPrice } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to view your orders",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await ordersAPI.getAll();
        setOrders(response.data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to fetch orders",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate, toast]);

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-600" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
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

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isDatePassed = (dateString: string | Date): boolean => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    if (isNaN(date.getTime())) {
      return false;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date <= today;
  };

  const canCancelOrder = (order: Order): boolean => {
    if (order.orderStatus === 'cancelled' || order.orderStatus === 'delivered') {
      return false;
    }

    if (!order.estimatedArrivalDate) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const estimatedArrival = new Date(order.estimatedArrivalDate);
    estimatedArrival.setHours(0, 0, 0, 0);
    
    const oneDayBefore = new Date(estimatedArrival);
    oneDayBefore.setDate(oneDayBefore.getDate() - 1);

    // Can cancel if today is at least one day before estimated delivery
    return today <= oneDayBefore;
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const response = await ordersAPI.cancel(orderId);
      toast({
        title: "Order Cancelled",
        description: "Order cancelled. Refund will be transferred in 7-10 working days.",
        variant: "default",
      });
      
      // Refresh orders list
      const updatedResponse = await ordersAPI.getAll();
      setOrders(updatedResponse.data);
    } catch (error: any) {
      toast({
        title: "Cancellation Failed",
        description: error.response?.data?.message || "Failed to cancel order",
        variant: "destructive",
      });
    }
  };

  const handleViewOrder = (orderId: string) => {
    navigate(`/payment-success?orderId=${orderId}`);
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <div className="flex items-center gap-4">
            {orders.length > 0 && (
              <span className="text-gray-600">
                {orders.length} {orders.length === 1 ? 'order' : 'orders'}
              </span>
            )}
            <button
              onClick={() => navigate('/cancelled-orders')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <XCircle className="h-5 w-5" />
              Cancelled Orders
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-8">Start shopping to see your orders here.</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Placed on {formatDate(order.orderDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusIcon(order.orderStatus)}
                      <span className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Items</h4>
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                          {item.product?.image || item.name?.charAt(0) || '📦'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {item.product?.name || item.name || 'Product'}
                          </h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          <p className="text-sm text-gray-500">Price: {formatPrice(item.price)} each</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                      <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                      <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Shipping Address</h4>
                    </div>
                    <div className="text-gray-700 text-sm ml-7">
                      <p className="font-medium">{order.shippingAddress.street}</p>
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="border-t pt-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                        <p className="text-2xl font-bold text-gray-900">{formatPrice(order.totalAmount)}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                          <p className={`font-semibold capitalize ${
                            order.paymentStatus === 'completed' 
                              ? 'text-green-600' 
                              : order.paymentStatus === 'failed'
                              ? 'text-red-600'
                              : 'text-yellow-600'
                          }`}>
                            {order.paymentStatus}
                          </p>
                        </div>
                        {order.razorpayPaymentId && (
                          <div className="text-right">
                            <p className="text-sm text-gray-600 mb-1">Transaction ID</p>
                            <p className="font-mono text-xs text-gray-700">
                              {order.razorpayPaymentId.slice(-12)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Estimated Arrival Date */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-semibold text-gray-700">Estimated Arrival Date</span>
                      </div>
                      {order.estimatedArrivalDate ? (
                        <span className={`text-sm font-semibold ${
                          isDatePassed(order.estimatedArrivalDate) && order.orderStatus !== 'delivered'
                            ? 'text-orange-600'
                            : order.orderStatus === 'delivered'
                            ? 'text-green-600'
                            : 'text-blue-600'
                        }`}>
                          {formatShortDate(order.estimatedArrivalDate)}
                          {isDatePassed(order.estimatedArrivalDate) && order.orderStatus !== 'delivered' && (
                            <span className="ml-2 text-xs font-normal">(Overdue)</span>
                          )}
                          {order.orderStatus === 'delivered' && (
                            <span className="ml-2 text-xs font-normal">(Delivered)</span>
                          )}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500 italic">
                          Calculating...
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 pt-4 border-t flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleViewOrder(order._id)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Eye className="h-5 w-5" />
                      View Order Details
                    </button>
                    {canCancelOrder(order) && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <X className="h-5 w-5" />
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Orders;
