import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus, CreditCard, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import Footer from '../components/Footer';

const Cart = () => {
  const { cartItems, removeFromCart, getCartTotal, loading, updateCartQuantity } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] pt-[70px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-10 w-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full"
        />
        <p className="mt-4 text-slate-500 font-black uppercase tracking-widest text-[10px] animate-pulse">Checking your bag...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-emerald-50/20 pt-[120px] pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <div className="bg-white rounded-[3rem] p-16 shadow-2xl shadow-emerald-500/5 mb-8 border border-emerald-50">
              <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <ShoppingBag className="h-10 w-10 text-emerald-600" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 mb-4">Your bag is empty</h1>
              <p className="text-slate-500 mb-10 font-medium">Looks like you haven't added anything to your bag yet. Start exploring our fresh harvest!</p>
              <Link
                to="/services"
                className="btn-premium bg-emerald-600 text-white w-full flex items-center justify-center gap-2"
              >
                Explore Products <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50/20 pt-[120px] pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-emerald-600 font-black text-xs uppercase tracking-[0.2em] mb-4 block">Shopping Bag</span>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none">Review your <span className="text-emerald-600">Selection.</span></h1>
          </motion.div>

          <Link to="/services" className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-black text-xs uppercase tracking-widest group transition-all">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Continue Shopping
          </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 xl:gap-20 items-start">

          {/* Cart Items List */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item, idx) => (
                  <motion.div
                    key={item.cartId}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    className="glass-card bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 flex flex-col sm:flex-row items-center gap-8 group hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-500"
                  >
                    {/* Item Image */}
                    <div className="w-full sm:w-32 lg:w-40 aspect-square bg-slate-50 rounded-3xl overflow-hidden flex items-center justify-center p-6 border border-slate-50 transition-colors group-hover:bg-emerald-50/50">
                      <img
                        src={item.imageUrl || "/images/placeholder-product.png"}
                        alt={item.productName}
                        onError={(e) => {
                          e.currentTarget.src = "/images/placeholder-product.png";
                        }}
                        className="w-full h-full object-contain filter drop-shadow-xl transform group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                        <div>
                          <Link
                            to={`/products/${item.productId}`}
                            className="text-2xl font-black text-slate-900 hover:text-emerald-600 transition-colors leading-tight"
                          >
                            {item.productName}
                          </Link>
                          <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">
                            Premium Grade
                          </p>
                        </div>
                        <div className="text-2xl font-black text-slate-900 tracking-tight">
                          ₹{item.totalPrice.toFixed(2)}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-8">
                        {/* Improved Counter */}
                        <div className="flex items-center bg-slate-100/50 rounded-2xl p-1 border border-slate-100">
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateCartQuantity?.(item.cartId, item.quantity - 1);
                              }
                            }}
                            disabled={item.quantity <= 1}
                            className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-white hover:text-emerald-600 rounded-xl shadow-sm transition-all font-black"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-10 text-center font-black text-slate-800 text-sm">{item.quantity}</span>
                          <button
                            onClick={() => {
                              updateCartQuantity?.(item.cartId, item.quantity + 1);
                            }}
                            className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-white hover:text-emerald-600 rounded-xl shadow-sm transition-all font-black"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.cartId)}
                          className="flex items-center gap-2 text-rose-500 hover:text-rose-600 font-black text-[10px] uppercase tracking-widest transition-colors"
                        >
                          <Trash2 className="h-4 w-4" /> Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Order Summary Column */}
          <div className="lg:col-span-1 sticky top-32">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl shadow-slate-950/20"
            >
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                <ShoppingCart className="h-6 w-6 text-emerald-500" /> Summary
              </h2>

              <div className="space-y-6 mb-10 pb-10 border-b border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-black text-xs uppercase tracking-widest">Subtotal</span>
                  <span className="text-xl font-bold tracking-tight">₹{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-black text-xs uppercase tracking-widest">Shipping</span>
                  <span className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.2em]">Complimentary</span>
                </div>
                <div className="flex justify-between items-center bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
                  <span className="text-emerald-500 font-black text-xs uppercase tracking-widest">Harvest Points</span>
                  <span className="text-emerald-500 font-bold">+{(getCartTotal() * 0.1).toFixed(0)}</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline mb-10">
                <span className="text-slate-400 font-black text-xs uppercase tracking-widest">Price</span>
                <span className="text-4xl font-black text-white tracking-tighter">₹{getCartTotal().toFixed(2)}</span>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/checkout')}
                className="w-full h-16 bg-emerald-600 hover:bg-emerald-500 text-white rounded-3xl font-black text-sm uppercase tracking-[0.15em] shadow-xl shadow-emerald-950/20 transition-all flex items-center justify-center gap-3"
              >
                Secure Checkout <CreditCard className="h-5 w-5" />
              </motion.button>

              <p className="mt-8 text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                Taxes calculated at checkout
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
