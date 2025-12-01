import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, XCircle, ArrowLeft, Eye, Calendar } from 'lucide-react';
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
  cancelledAt?: string;
  estimatedArrivalDate?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
}

const CancelledOrders = () => {
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
        description: "Please log in to view cancelled orders",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    const fetchCancelledOrders = async () => {
      try {
        setLoading(true);
        const response = await ordersAPI.getCancelled();
        setOrders(response.data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to fetch cancelled orders",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCancelledOrders();
  }, [user, navigate, toast]);

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

  const handleViewOrder = (orderId: string) => {
    navigate(`/payment-success?orderId=${orderId}`);
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/orders')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Cancelled Orders</h1>
          </div>
          {orders.length > 0 && (
            <span className="text-gray-600">
              {orders.length} {orders.length === 1 ? 'cancelled order' : 'cancelled orders'}
            </span>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading cancelled orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <XCircle className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No cancelled orders</h2>
            <p className="text-gray-600 mb-8">You haven't cancelled any orders yet.</p>
            <button
              onClick={() => navigate('/orders')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View My Orders
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-gray-200">
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
                      <XCircle className="h-6 w-6 text-red-600" />
                      <span className="px-4 py-1.5 rounded-full text-sm font-semibold capitalize bg-red-100 text-red-800">
                        Cancelled
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
                      <Calendar className="h-5 w-5 text-red-600 mt-0.5" />
                      <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Cancellation Details</h4>
                    </div>
                    <div className="text-gray-700 text-sm ml-7">
                      <p className="font-medium">Cancelled on: {order.cancelledAt ? formatDate(order.cancelledAt) : 'N/A'}</p>
                      <p className="text-red-600 font-semibold mt-2">
                        Refund will be transferred in 7-10 working days
                      </p>
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
                          <p className="font-semibold capitalize text-gray-600">
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

                  {/* Action Button */}
                  <div className="mt-6 pt-4 border-t">
                    <button
                      onClick={() => handleViewOrder(order._id)}
                      className="w-full md:w-auto bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Eye className="h-5 w-5" />
                      View Order Details
                    </button>
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

export default CancelledOrders;


