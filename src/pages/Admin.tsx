import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Package, ShoppingCart, DollarSign, Plus, Trash2, Edit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import { useCart } from '../context/CartContext';
import AdminLayout from '../components/AdminLayout';
import { adminAPI, productsAPI } from '../services/api';

const Admin = () => {
  const { user } = useAuth();
  const { formatPrice } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'products'>('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    image: '📦',
    images: ['📦', '📦', '📦', '📦'],
    stock: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      });
      navigate('/');
      return;
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, productsRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers(),
        productsAPI.getAll()
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setProducts(productsRes.data?.products || productsRes.data || []);
    } catch (error: any) {
      console.error('Admin fetch error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to fetch data. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await adminAPI.deleteUser(userId);
      toast({ title: "Success", description: "User deleted successfully" });
      fetchData();
    } catch (error: any) {
      console.error('Delete user error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!productForm.name || !productForm.description || !productForm.price || !productForm.stock) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const priceNum = parseInt(productForm.price);
    const stockNum = parseInt(productForm.stock);

    if (isNaN(priceNum) || priceNum < 0) {
      toast({
        title: "Validation Error",
        description: "Price must be a valid positive number",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(stockNum) || stockNum < 0) {
      toast({
        title: "Validation Error",
        description: "Stock must be a valid positive number",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const productData = {
        name: productForm.name.trim(),
        description: productForm.description.trim(),
        price: priceNum,
        stock: stockNum,
        category: productForm.category,
        image: productForm.image || '📦',
        images: productForm.images || ['📦', '📦', '📦', '📦']
      };

      if (editingProduct) {
        await productsAPI.update(editingProduct._id, productData);
        toast({ title: "Success", description: "Product updated successfully" });
      } else {
        await productsAPI.create(productData);
        toast({ title: "Success", description: "Product created successfully" });
      }
      
      setShowProductForm(false);
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        price: '',
        category: 'Electronics',
        image: '📦',
        images: ['📦', '📦', '📦', '📦'],
        stock: ''
      });
      fetchData();
    } catch (error: any) {
      console.error('Product save error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to save product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      images: product.images,
      stock: product.stock.toString()
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await productsAPI.delete(productId);
      toast({ title: "Success", description: "Product deleted successfully" });
      fetchData();
    } catch (error: any) {
      console.error('Delete product error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'users'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'products'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Products
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Dashboard Overview</h2>
                  <button
                    onClick={fetchData}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Refresh
                  </button>
                </div>
                {stats ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalUsers || 0}</p>
                          </div>
                          <Users className="h-10 w-10 text-blue-600" />
                        </div>
                      </div>
                      <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Total Products</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalProducts || 0}</p>
                          </div>
                          <Package className="h-10 w-10 text-green-600" />
                        </div>
                      </div>
                      <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Total Orders</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalOrders || 0}</p>
                          </div>
                          <ShoppingCart className="h-10 w-10 text-purple-600" />
                        </div>
                      </div>
                      <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalRevenue || 0)}</p>
                          </div>
                          <DollarSign className="h-10 w-10 text-yellow-600" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h2>
                      {stats.recentOrders && stats.recentOrders.length > 0 ? (
                        <div className="space-y-4">
                          {stats.recentOrders.map((order: any) => (
                            <div key={order._id} className="flex items-center justify-between border-b pb-4">
                              <div>
                                <p className="font-medium text-gray-900">Order #{order._id.slice(-8)}</p>
                                <p className="text-sm text-gray-600">
                                  {order.user?.name || order.user?.email || 'Unknown User'}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">{formatPrice(order.totalAmount || 0)}</p>
                                <p className="text-sm text-gray-600 capitalize">{order.orderStatus || 'pending'}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600">No recent orders</p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                    <p className="text-gray-600">Loading dashboard statistics...</p>
                  </div>
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">All Users</h2>
                  <button
                    onClick={fetchData}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Refresh
                  </button>
                </div>
                <div className="overflow-x-auto">
                  {users.length === 0 ? (
                    <div className="p-12 text-center">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No users found</p>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {users.map((u) => (
                          <tr key={u._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{u.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{u.phone || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {u._id !== user._id && (
                                <button
                                  onClick={() => handleDeleteUser(u._id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">All Products</h2>
                  <div className="flex gap-3">
                    <button
                      onClick={fetchData}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Refresh
                    </button>
                    <button
                      onClick={() => {
                        setShowProductForm(true);
                        setEditingProduct(null);
                        setProductForm({
                          name: '',
                          description: '',
                          price: '',
                          category: 'Electronics',
                          image: '📦',
                          images: ['📦', '📦', '📦', '📦'],
                          stock: ''
                        });
                      }}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-5 w-5" />
                      Add Product
                    </button>
                  </div>
                </div>

                {showProductForm && (
                  <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <form onSubmit={handleProductSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                          <input
                            type="text"
                            required
                            value={productForm.name}
                            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                          <select
                            value={productForm.category}
                            onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option>Electronics</option>
                            <option>Fashion</option>
                            <option>Sports</option>
                            <option>Home & Garden</option>
                            <option>Books & Media</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                          <input
                            type="number"
                            required
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                          <input
                            type="number"
                            required
                            value={productForm.stock}
                            onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Image (Emoji)</label>
                          <input
                            type="text"
                            required
                            value={productForm.image}
                            onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                          <textarea
                            required
                            value={productForm.description}
                            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          {editingProduct ? 'Update Product' : 'Add Product'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowProductForm(false);
                            setEditingProduct(null);
                          }}
                          className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {products.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No products found</p>
                    <button
                      onClick={() => {
                        setShowProductForm(true);
                        setEditingProduct(null);
                      }}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                    >
                      <Plus className="h-5 w-5" />
                      Add Your First Product
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <div key={product._id} className="bg-white rounded-lg shadow-sm border p-4">
                        <div className="text-5xl mb-3 text-center">{product.image}</div>
                        <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
                          <span className="text-sm text-gray-600">Stock: {product.stock}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="flex-1 flex items-center justify-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="flex-1 flex items-center justify-center gap-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default Admin;
