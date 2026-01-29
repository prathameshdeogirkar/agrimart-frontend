import { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, ArrowRight, Download, History, ShoppingBag } from 'lucide-react';
import Footer from '../components/Footer';

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state?.order;

    useEffect(() => {
        if (!order) {
            const timer = setTimeout(() => navigate('/orders'), 5000);
            return () => clearTimeout(timer);
        }
    }, [order, navigate]);

    if (!order) {
        return (
            <div className="min-h-screen pt-[120px] flex flex-col items-center justify-center bg-white">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-10 w-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full mb-4"
                />
                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] animate-pulse">Retrieving order details...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-[140px] bg-emerald-50/20 pb-24">
            <div className="max-w-4xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[3.5rem] shadow-2xl shadow-emerald-500/5 border border-emerald-50 overflow-hidden"
                >
                    <div className="p-12 sm:p-20 text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", damping: 12, stiffness: 200 }}
                            className="w-24 h-24 bg-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-emerald-600/30"
                        >
                            <CheckCircle2 className="w-12 h-12 text-white" />
                        </motion.div>

                        <span className="text-emerald-600 font-black text-xs uppercase tracking-[0.2em] mb-4 block">Order Confirmed</span>
                        <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Pure Quality, <br /><span className="text-emerald-600">Successfully Ordered.</span></h1>

                        <p className="text-slate-500 max-w-lg mx-auto mb-12 font-medium leading-relaxed">
                            Thank you for choosing AgriMart. We've received your harvest request and sent a detailed confirmation to your email. Your fresh products are being prepared.
                        </p>

                        <div className="glass-card bg-slate-50/50 rounded-[2.5rem] p-10 mb-12 border border-slate-100 text-left">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10 pb-10 border-b border-slate-100">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Internal Tracking ID</p>
                                    <p className="text-xl font-black text-slate-900 tracking-tight">#{order?.publicOrderId || order?.orderId}</p>
                                </div>
                                <div className="text-center md:text-right">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Final Investment</p>
                                    <p className="text-3xl font-black text-emerald-600 tracking-tighter">₹{order.totalAmount.toFixed(2)}</p>
                                </div>
                            </div>

                            <h3 className="font-black text-xs uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
                                <Package className="h-4 w-4 text-emerald-600" /> Manifest Summary
                            </h3>

                            <div className="space-y-6 mb-10">
                                {order.items && order.items.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-white rounded-2xl border border-slate-100 flex items-center justify-center p-2 group-hover:border-emerald-500 transition-colors">
                                                {item.productImageUrl ? (
                                                    <img src={item.productImageUrl} alt="" className="w-full h-full object-contain" />
                                                ) : (
                                                    <span className="text-xl">🥬</span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 text-sm tracking-tight">{item.productName}</p>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Yield: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-black text-slate-900 text-sm tracking-tight">₹{(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-8 border-t border-slate-100">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Shipping to Destination</p>
                                <p className="font-bold text-slate-900 text-sm">{order.address}, {order.city} - {order.pincode}</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={async () => {
                                    const { orderService } = await import('../services/orderService');
                                    const toast = (await import('react-hot-toast')).default;
                                    const loadingToast = toast.loading('Generating Manifest...');
                                    const result = await orderService.downloadInvoice(order.orderId);
                                    toast.dismiss(loadingToast);
                                    if (result.success) {
                                        toast.success('Manifest Downloaded!');
                                    } else {
                                        toast.error(result.error || 'Failed to download');
                                    }
                                }}
                                className="h-14 px-8 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-emerald-600 hover:text-emerald-600 transition-all flex items-center justify-center gap-3"
                            >
                                <Download className="h-4 w-4" /> Download Manifest
                            </motion.button>

                            <Link
                                to="/orders"
                                className="h-14 px-8 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-emerald-600 hover:text-emerald-600 transition-all flex items-center justify-center gap-3"
                            >
                                <History className="h-4 w-4" /> Order History
                            </Link>

                            <Link
                                to="/services"
                                className="h-14 px-10 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-500 transition-all flex items-center justify-center gap-3"
                            >
                                <ShoppingBag className="h-4 w-4" /> Boutique Store <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
};

export default OrderSuccess;
