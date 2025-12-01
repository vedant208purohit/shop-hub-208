import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Loader2, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import Layout from '../components/Layout';
import { paymentsAPI } from '../services/api';
import { indianStates, indianStatesCities, validatePincode as validatePincodeFormat } from '../data/indianStatesCities';
import { validatePincode } from '../services/pincodeAPI';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Checkout = () => {
  const { cart, getCartTotal, clearCart, formatPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });
  const [errors, setErrors] = useState({
    street: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [validatingPincode, setValidatingPincode] = useState(false);

  // Redirect if cart is empty or user not logged in
  React.useEffect(() => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to checkout",
        variant: "destructive",
      });
      navigate('/login');
    } else if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Add items to your cart first",
        variant: "destructive",
      });
      navigate('/products');
    }
  }, [user, cart, navigate, toast]);

  // Update cities when state changes
  useEffect(() => {
    if (shippingAddress.state) {
      const cities = indianStatesCities[shippingAddress.state] || [];
      setAvailableCities(cities);
      // Reset city when state changes
      setShippingAddress(prev => ({ ...prev, city: '' }));
    } else {
      setAvailableCities([]);
    }
  }, [shippingAddress.state]);

  // Validate pincode against selected city
  const validatePincodeWithCity = async (pincode: string, city: string): Promise<string> => {
    if (!pincode || pincode.length !== 6) {
      return '';
    }

    if (!validatePincodeFormat(pincode)) {
      return 'Invalid pincode. Must start with 1-9 and contain only digits';
    }

    if (!city) {
      return '';
    }

    try {
      setValidatingPincode(true);
      const pincodeData = await validatePincode(pincode);
      
      if (!pincodeData) {
        return 'Pincode not found. Please enter a valid pincode';
      }

      // Normalize city names for comparison - remove all spaces, convert to lowercase
      const normalizeCity = (cityName: string) => 
        cityName.toLowerCase().trim().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
      
      const selectedCityNormalized = normalizeCity(city);
      const pincodeCityNormalized = normalizeCity(pincodeData.city);
      const pincodeDistrictNormalized = normalizeCity(pincodeData.district);

      // Also check if one contains the other (for cases like "Gandhinagar" vs "Gandhi Nagar")
      const selectedWords = city.toLowerCase().split(/\s+/).filter(w => w.length > 2);
      const pincodeCityWords = pincodeData.city.toLowerCase().split(/\s+/).filter(w => w.length > 2);
      const pincodeDistrictWords = pincodeData.district.toLowerCase().split(/\s+/).filter(w => w.length > 2);

      // Check multiple matching strategies
      const exactMatch = 
        pincodeCityNormalized === selectedCityNormalized ||
        pincodeDistrictNormalized === selectedCityNormalized;

      const containsMatch = 
        pincodeCityNormalized.includes(selectedCityNormalized) ||
        selectedCityNormalized.includes(pincodeCityNormalized) ||
        pincodeDistrictNormalized.includes(selectedCityNormalized) ||
        selectedCityNormalized.includes(pincodeDistrictNormalized);

      // Check if key words match (e.g., "Gandhi" in both "Gandhinagar" and "Gandhi Nagar")
      const wordMatch = 
        selectedWords.some(word => pincodeCityWords.includes(word) || pincodeDistrictWords.includes(word)) ||
        pincodeCityWords.some(word => selectedWords.includes(word)) ||
        pincodeDistrictWords.some(word => selectedWords.includes(word));

      if (!exactMatch && !containsMatch && !wordMatch) {
        return `Pincode not from ${city}. This pincode belongs to ${pincodeData.city}`;
      }

      return '';
    } catch (error) {
      console.error('Error validating pincode:', error);
      return 'Unable to validate pincode. Please try again.';
    } finally {
      setValidatingPincode(false);
    }
  };

  // Validate form fields
  const validateForm = async (): Promise<boolean> => {
    const newErrors = {
      street: '',
      city: '',
      state: '',
      pincode: ''
    };

    let isValid = true;

    if (!shippingAddress.street.trim()) {
      newErrors.street = 'Street address is required';
      isValid = false;
    }

    if (!shippingAddress.state) {
      newErrors.state = 'Please select a state';
      isValid = false;
    }

    if (!shippingAddress.city) {
      newErrors.city = 'Please select a city';
      isValid = false;
    }

    if (!shippingAddress.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
      isValid = false;
    } else if (shippingAddress.pincode.length !== 6) {
      newErrors.pincode = 'Pincode must be exactly 6 digits';
      isValid = false;
    } else if (!validatePincodeFormat(shippingAddress.pincode)) {
      newErrors.pincode = 'Invalid pincode. Must start with 1-9 and contain only digits';
      isValid = false;
    } else if (shippingAddress.city) {
      // Validate pincode against selected city
      const pincodeError = await validatePincodeWithCity(shippingAddress.pincode, shippingAddress.city);
      if (pincodeError) {
        newErrors.pincode = pincodeError;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = await validateForm();
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    if (!window.Razorpay) {
      toast({
        title: "Payment Error",
        description: "Razorpay SDK not loaded. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const tax = getCartTotal() * 0.18; // 18% GST
      const total = getCartTotal() + tax;

      // Validate total amount
      if (total <= 0 || total > 1000000) {
        toast({
          title: "Invalid Amount",
          description: "Please check your cart total",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // Create Razorpay order (amount should be in rupees, backend will convert to paise)
      const razorpayOrderResponse = await paymentsAPI.createOrder(Number(total.toFixed(2)), 'INR');
      const { id: razorpayOrderId, key } = razorpayOrderResponse.data;

      // Prepare order items for backend
      const orderItems = cart.map(item => ({
        product: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }));

      // Open Razorpay checkout
      const options = {
        key: key,
        amount: razorpayOrderResponse.data.amount,
        currency: razorpayOrderResponse.data.currency,
        name: 'Shop Hub',
        description: `Order for ${cart.length} item(s)`,
        order_id: razorpayOrderId,
        // Explicitly enable all payment methods
        method: {
          card: true,
          netbanking: true,
          wallet: true,
          upi: true,
        },
        // Allow all card networks
        config: {
          display: {
            blocks: {
              banks: {
                name: "All payment methods",
                instruments: [
                  {
                    method: "card",
                    networks: ["Visa", "MasterCard", "RuPay", "Maestro", "Amex", "Diners"]
                  }
                ]
              }
            },
            sequence: ["block.banks"],
            preferences: {
              show_default_blocks: true
            }
          }
        },
        handler: async function (response: any) {
          try {
            // Verify payment and create order
            const verifyResponse = await paymentsAPI.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              items: orderItems,
              shippingAddress,
              totalAmount: total,
            });

            // Navigate to payment success page with order data
            clearCart();
            navigate('/payment-success', {
              state: {
                orderData: verifyResponse.data
              }
            });
          } catch (error: any) {
            toast({
              title: "Payment Verification Failed",
              description: error.response?.data?.message || "Failed to verify payment",
              variant: "destructive",
            });
            setIsProcessing(false);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: {
          color: '#4F46E5',
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            toast({
              title: "Payment Cancelled",
              description: "You cancelled the payment process",
            });
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.response?.data?.message || "Failed to initialize payment",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  if (!user || cart.length === 0) {
    return null;
  }

  const tax = getCartTotal() * 0.18; // 18% GST
  const total = getCartTotal() + tax;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Cart
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleCheckout} className="space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.street}
                      onChange={(e) => {
                        setShippingAddress({ ...shippingAddress, street: e.target.value });
                        setErrors({ ...errors, street: '' });
                      }}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.street ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter street address"
                    />
                    {errors.street && (
                      <p className="mt-1 text-sm text-red-600">{errors.street}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={shippingAddress.state}
                      onChange={(e) => {
                        setShippingAddress({ ...shippingAddress, state: e.target.value, city: '' });
                        setErrors({ ...errors, state: '', city: '' });
                      }}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select State</option>
                      {indianStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={shippingAddress.city}
                      onChange={async (e) => {
                        setShippingAddress({ ...shippingAddress, city: e.target.value });
                        setErrors({ ...errors, city: '', pincode: '' });
                        
                        // Re-validate pincode when city changes
                        if (shippingAddress.pincode.length === 6 && e.target.value) {
                          const error = await validatePincodeWithCity(shippingAddress.pincode, e.target.value);
                          if (error) {
                            setErrors({ ...errors, city: '', pincode: error });
                          }
                        }
                      }}
                      disabled={!shippingAddress.state || availableCities.length === 0}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      } ${!shippingAddress.state ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    >
                      <option value="">
                        {!shippingAddress.state ? 'Select State First' : 'Select City'}
                      </option>
                      {availableCities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={shippingAddress.pincode}
                      onChange={async (e) => {
                        const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                        if (value.length <= 6) {
                          setShippingAddress({ ...shippingAddress, pincode: value });
                          setErrors({ ...errors, pincode: '' });
                          
                          // Validate pincode against city when both are filled
                          if (value.length === 6 && shippingAddress.city) {
                            const error = await validatePincodeWithCity(value, shippingAddress.city);
                            if (error) {
                              setErrors({ ...errors, pincode: error });
                            }
                          }
                        }
                      }}
                      onBlur={async () => {
                        // Validate when user leaves the field
                        if (shippingAddress.pincode.length === 6 && shippingAddress.city) {
                          const error = await validatePincodeWithCity(shippingAddress.pincode, shippingAddress.city);
                          if (error) {
                            setErrors({ ...errors, pincode: error });
                          } else {
                            setErrors({ ...errors, pincode: '' });
                          }
                        }
                      }}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.pincode ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter 6-digit pincode"
                      disabled={validatingPincode}
                    />
                    {validatingPincode && (
                      <p className="mt-1 text-sm text-blue-600">Validating pincode...</p>
                    )}
                    {errors.pincode && (
                      <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>
                    )}
                    {shippingAddress.pincode && 
                     !errors.pincode && 
                     !validatingPincode &&
                     shippingAddress.pincode.length === 6 && 
                     shippingAddress.city && (
                      <p className="mt-1 text-sm text-green-600">✓ Valid pincode for {shippingAddress.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter country"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-600 p-3 rounded-lg">
                      <CreditCard className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">Secure Payment via Razorpay</h3>
                      <p className="text-sm text-gray-600">
                        Pay securely using Credit/Debit Card, UPI, Net Banking, or Wallets
                      </p>
                    </div>
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <div className="flex flex-wrap gap-2">
                      {['Cards', 'UPI', 'Net Banking', 'Wallets'].map((method) => (
                        <span key={method} className="text-xs bg-white px-3 py-1 rounded-full border border-gray-200">
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Proceed to Payment'
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center text-2xl">
                      {item.image}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                      <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (GST 18%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
