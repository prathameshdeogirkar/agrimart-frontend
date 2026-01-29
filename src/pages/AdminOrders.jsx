import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { orderService as invoiceService } from '../services/orderService';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { X, Download, Package, MapPin, CreditCard, Calendar, Search, RefreshCw } from 'lucide-react';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllOrders();
            setOrders(data);
        } catch (error) {
            toast.error('Failed to load orders: ' + (error.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await adminService.updateOrderStatus(orderId, newStatus);
            toast.success(`Order updated to ${newStatus}`);
            // Refresh local state
            setOrders(orders.map(order =>
                order.orderId === orderId ? { ...order, status: newStatus } : order
            ));

            // Also update selected order if open
            if (selectedOrder && selectedOrder.orderId === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDownloadInvoice = async (orderId) => {
        const loadingToast = toast.loading('Generating Invoice...');
        try {
            const result = await invoiceService.downloadInvoice(orderId);
            if (result.success) {
                toast.success('Invoice Downloaded', { id: loadingToast });
            } else {
                toast.error('Failed to download invoice', { id: loadingToast });
            }
        } catch (error) {
            toast.error('Error downloading invoice', { id: loadingToast });
        }
    };

    // 🔍 Search Filtering Logic
    const filteredOrders = orders.filter(order => {
        const searchLower = searchTerm.toLowerCase().trim();
        if (!searchLower) return true;

        const publicId = (order.publicOrderId || '').toLowerCase();
        const orderIdStr = String(order.orderId || '').toLowerCase();
        const fullName = (order.fullName || '').toLowerCase();
        const mobile = (order.mobile || '').toLowerCase();
        const status = (order.status || '').toLowerCase();

        return publicId.includes(searchLower) ||
            orderIdStr.includes(searchLower) ||
            fullName.includes(searchLower) ||
            mobile.includes(searchLower) ||
            status.includes(searchLower);
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'PLACED': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'SHIPPED': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200';
            case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen pt-[70px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-[80px] pb-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Package className="h-8 w-8 text-green-600" />
                        Manage Orders
                    </h1>

                    <div className="flex flex-1 max-w-md w-full gap-2">
                        <div className="relative flex-1">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                <Search className="h-5 w-5" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search by ID, Name, Mobile or Status..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                        <button
                            onClick={fetchOrders}
                            className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1 bg-white px-4 py-2 rounded-lg border border-green-200 shadow-sm transition-all hover:shadow-md"
                        >
                            <RefreshCw className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOrders.map((order) => (
                                    <tr key={order.orderId} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                                            {order.publicOrderId || order.orderId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.orderDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{order.fullName}</span>
                                                <span className="text-xs text-gray-500">{order.mobile}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                                            ₹{order.totalAmount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                                                className={`text-xs font-bold px-3 py-1 rounded-full border cursor-pointer focus:ring-2 focus:ring-green-500 outline-none transition-colors ${getStatusColor(order.status)}`}
                                            >
                                                <option value="PLACED">PLACED</option>
                                                <option value="SHIPPED">SHIPPED</option>
                                                <option value="DELIVERED">DELIVERED</option>
                                                <option value="CANCELLED">CANCELLED</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded text-xs font-medium transition-colors"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredOrders.length === 0 && (
                        <div className="text-center py-16 bg-gray-50">
                            {searchTerm ? (
                                <>
                                    <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 font-medium text-lg">No orders match your search.</p>
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="text-green-600 hover:text-green-700 font-medium underline mt-2"
                                    >
                                        Clear search
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 font-medium">No orders found.</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-[2000] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">

                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <Package className="h-5 w-5 text-green-600" />
                                    Order Details
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">ID: <span className="font-mono font-medium text-gray-700">{selectedOrder.publicOrderId || selectedOrder.orderId}</span></p>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div className="p-6 overflow-y-auto custom-scrollbar">

                            {/* Status & Date */}
                            <div className="flex flex-wrap gap-4 mb-8">
                                <div className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Status</p>
                                    <select
                                        value={selectedOrder.status}
                                        onChange={(e) => handleStatusChange(selectedOrder.orderId, e.target.value)}
                                        className={`text-sm font-bold px-3 py-1 rounded-full border cursor-pointer outline-none ${getStatusColor(selectedOrder.status)}`}
                                    >
                                        <option value="PLACED">PLACED</option>
                                        <option value="SHIPPED">SHIPPED</option>
                                        <option value="DELIVERED">DELIVERED</option>
                                        <option value="CANCELLED">CANCELLED</option>
                                    </select>
                                </div>
                                <div className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1 flex items-center gap-1">
                                        <Calendar className="h-3 w-3" /> Order Date
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {new Date(selectedOrder.orderDate).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Price</p>
                                    <p className="font-bold text-xl text-green-600">₹{selectedOrder.totalAmount}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                {/* Customer Info */}
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2 flex items-center gap-2">
                                        <MapPin className="h-4 w-4" /> Shipping Details
                                    </h3>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <p><span className="font-semibold text-gray-900">Name:</span> {selectedOrder.fullName}</p>
                                        <p><span className="font-semibold text-gray-900">Phone:</span> {selectedOrder.mobile}</p>
                                        <p><span className="font-semibold text-gray-900">Address:</span></p>
                                        <p className="pl-4 border-l-2 border-gray-200 italic">
                                            {selectedOrder.address}<br />
                                            {selectedOrder.city} - {selectedOrder.pincode}
                                        </p>
                                    </div>
                                </div>

                                {/* Payment Info */}
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2 flex items-center gap-2">
                                        <CreditCard className="h-4 w-4" /> Payment Info
                                    </h3>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <p><span className="font-semibold text-gray-900">Mode:</span> {selectedOrder.paymentMode}</p>
                                        <p><span className="font-semibold text-gray-900">Status:</span>
                                            <span className="ml-2 px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                                                PAID
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Order Items</h3>
                            <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="px-6 py-4 flex items-center gap-3">
                                                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white">
                                                        <img
                                                            src={item.productImageUrl || "/images/placeholder-product.png"}
                                                            alt={item.productName}
                                                            onError={(e) => {
                                                                e.currentTarget.src = "/images/placeholder-product.png";
                                                            }}
                                                            className="h-full w-full object-cover object-center"
                                                        />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900">{item.productName}</span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">₹{item.price}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">x {item.quantity}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">₹{item.price * item.quantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                            <button
                                onClick={() => handleDownloadInvoice(selectedOrder.orderId)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm"
                            >
                                <Download className="h-4 w-4" /> Download Invoice
                            </button>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
