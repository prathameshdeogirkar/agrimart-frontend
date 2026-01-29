import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Lock, CreditCard, Truck,
  MapPin, Phone, User, CheckCircle2,
  ArrowLeft, ShoppingBag, Loader2, Info
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import { useRazorpay } from '../hooks/useRazorpay';
import Footer from '../components/Footer';

const Checkout = () => {
  const { cartItems, getCartTotal, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    address: '',
    city: '',
    pincode: '',
    paymentMode: 'COD',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (cartItems.length === 0 && !loading) {
      navigate('/cart');
    }
  }, [cartItems.length, navigate, loading]);

  const { loadRazorpay } = useRazorpay();

  useEffect(() => {
    loadRazorpay();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (formData.paymentMode === 'COD') {
        const result = await orderService.checkout(formData);
        if (result.success) {
          await fetchCart();
          navigate('/order-success', { state: { order: result.data } });
        } else {
          setError(result.error || 'Checkout failed');
          setLoading(false);
        }
      } else {
        await handleRazorpayPayment();
      }
    } catch (err) {
      setError(err.message || 'Checkout failed. Please try again.');
      setLoading(false);
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      const orderData = await paymentService.createOrder();
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Agrimart",
        description: "Payment for your order",
        image: "/logo2.png",
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            const verificationData = {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              checkoutRequest: formData
            };
            const verifyResult = await paymentService.verifyPayment(verificationData);
            if (verifyResult.success) {
              await fetchCart();
              navigate('/order-success', { state: { order: verifyResult.data } });
            } else {
              setError(verifyResult.error);
              setLoading(false);
            }
          } catch (verifyError) {
            setError('Payment verification failed');
            setLoading(false);
          }
        },
        prefill: {
          name: formData.fullName,
          contact: formData.mobile,
          email: user?.email
        },
        theme: {
          color: "#059669"
        },
        modal: {
          ondismiss: () => setLoading(false)
        }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError('Failed to initiate payment: ' + (err.message || err));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50/20 pt-[120px] pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-emerald-600 font-black text-xs uppercase tracking-[0.2em] mb-4 block">Secure Checkout</span>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none">Confirm your <span className="text-emerald-600">Order.</span></h1>
          </motion.div>

          <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-black text-xs uppercase tracking-widest group transition-all">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Bag
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-start">

          {/* Left Column: Premium Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card bg-white p-10 sm:p-12 rounded-[3.5rem] shadow-2xl shadow-emerald-500/5 border border-emerald-50"
          >
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-600/20">
                  <MapPin className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-black text-slate-900">Shipping Details</h2>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-xs font-black uppercase tracking-widest border border-rose-100 flex items-center gap-3"
                >
                  <Info className="h-5 w-5" /> {error}
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-bold transition-all placeholder:text-slate-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Mobile Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                    <input
                      type="tel"
                      name="mobile"
                      required
                      placeholder="10-digit mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-bold transition-all placeholder:text-slate-300"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Delivery Address</label>
                <textarea
                  name="address"
                  required
                  rows="3"
                  placeholder="Street name, landmark..."
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-bold transition-all placeholder:text-slate-300 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="Mumbai"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-bold transition-all placeholder:text-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    placeholder="400001"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-bold transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Payment Method</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 'COD', label: 'Cash on Delivery', icon: <Truck className="h-5 w-5" /> },
                    { id: 'UPI', label: 'Online Payment', icon: <CreditCard className="h-5 w-5" /> },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setFormData(f => ({ ...f, paymentMode: mode.id }))}
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${formData.paymentMode === mode.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-lg shadow-emerald-500/10'
                        : 'border-slate-100 bg-white text-slate-500 hover:border-emerald-200'
                        }`}
                    >
                      <div className={`p-2 rounded-xl ${formData.paymentMode === mode.id ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                        {mode.icon}
                      </div>
                      <span className="font-bold text-sm tracking-tight">{mode.label}</span>
                      {formData.paymentMode === mode.id && <CheckCircle2 className="h-5 w-5 ml-auto text-emerald-600" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 bg-emerald-600 hover:bg-emerald-500 text-white rounded-3xl font-black text-sm uppercase tracking-[0.15em] shadow-2xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> Processing order...
                    </>
                  ) : (
                    <>
                      <Lock className="h-5 w-5" /> Place Secure Order
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Right Column: Immersive Order Summary */}
          <div className="lg:col-span-1 sticky top-32">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-900 rounded-[3.5rem] p-10 sm:p-12 text-white shadow-2xl shadow-slate-950/20"
            >
              <h2 className="text-2xl font-black mb-10 flex items-center gap-3">
                <ShoppingBag className="h-6 w-6 text-emerald-500" /> Your Order
              </h2>

              <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-4 scrollbar-hide mb-10">
                {cartItems.map((item) => (
                  <div key={item.cartId} className="flex gap-6 items-center group">
                    <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center p-2 border border-slate-700 font-black text-xl group-hover:border-emerald-500 transition-colors">
                      <img
                        src={item.imageUrl || "/images/placeholder-product.png"}
                        alt={item.productName}
                        onError={(e) => {
                          e.currentTarget.src = "/images/placeholder-product.png";
                        }}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm tracking-tight">{item.productName}</h4>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Quantity x{item.quantity}</p>
                    </div>
                    <div className="font-black text-sm">₹{item.totalPrice.toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-6 pt-10 border-t border-slate-800 mb-10">
                <div className="flex justify-between items-center text-slate-400 font-black text-xs uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-white text-lg font-bold">₹{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400 font-black text-xs uppercase tracking-widest">
                  <span>Shipping</span>
                  <span className="text-emerald-500 text-[10px] uppercase tracking-[0.2em]">Complimentary</span>
                </div>
                <div className="flex justify-between items-baseline pt-4">
                  <span className="text-slate-400 font-black text-xs uppercase tracking-widest">Order Total</span>
                  <span className="text-5xl font-black text-white tracking-tighter">₹{getCartTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-3xl p-6 border border-white/5 flex items-start gap-4">
                <ShieldCheck className="h-10 w-10 text-emerald-500 flex-shrink-0" />
                <div>
                  <h5 className="font-black text-xs uppercase tracking-widest mb-1 text-emerald-500">Buyer Protection</h5>
                  <p className="text-slate-400 font-medium text-[11px] leading-relaxed">
                    Your transactions are secure. AgriMart ensures 100% fresh products or instant refund.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
