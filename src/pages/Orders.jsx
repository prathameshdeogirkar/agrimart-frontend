import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import Footer from '../components/Footer';

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const result = await orderService.getOrders();
      if (result.success) {
        setOrders(result.data || []);
      } else {
        console.error('Error fetching orders:', result.error);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <>
        <div className="flex items-center justify-center min-h-screen pt-[70px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="min-h-screen pt-[70px] bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">My Orders</h1>

          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">You have no orders yet</p>
              <Link
                to="/"
                className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.orderId} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.publicOrderId || order.orderId}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Name:</span>{' '}
                        <span className="font-medium">{order.fullName}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Mobile:</span>{' '}
                        <span className="font-medium">{order.mobile}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600">Address:</span>{' '}
                        <span className="font-medium">
                          {order.address}, {order.city} - {order.pincode}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Payment:</span>{' '}
                        <span className="font-medium">{order.paymentMode}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-600">Total:</span>{' '}
                        <span className="font-bold text-primary text-lg">
                          ₹{order.totalAmount.toFixed(2)}
                        </span>

                        <button
                          onClick={async () => {
                            const toast = (await import('react-hot-toast')).default;
                            const loading = toast.loading('Downloading...');
                            const result = await orderService.downloadInvoice(order.orderId);
                            toast.dismiss(loading);
                            if (result.success) {
                              toast.success('Downloaded!');
                            } else {
                              toast.error('Failed to download');
                            }
                          }}
                          className="ml-4 text-sm text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                        >
                          <span>📄</span> Invoice
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div >
      <Footer />
    </>
  );
};

export default Orders;


