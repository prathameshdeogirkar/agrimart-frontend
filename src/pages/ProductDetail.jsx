import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ShoppingCart, Zap, ShieldCheck,
  Truck, Leaf, CheckCircle2, ChevronDown,
  Info, Calendar, Heart, Share2, Plus, Minus
} from 'lucide-react';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import { toast } from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState({
    shelfLife: true,
    healthBenefits: false,
    storage: false,
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getById(id);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    if (product) {
      setSelectedImage(product.imageUrl);
    }
  }, [product]);

  const allImages = product ? [product.imageUrl || "/images/placeholder-product.png", ...(product.galleryImages || [])].filter(Boolean) : [];

  const handleAddToCart = async (isBuyNow = false) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const result = await addToCart(product.id, quantity);
    if (result.success) {
      if (isBuyNow) {
        navigate('/checkout');
      } else {
        toast.success(`Fresh ${product.name} added to bag!`);
      }
    } else {
      toast.error(result.error || 'Could not add to cart');
    }
  };

  const toggleSection = (section) => {
    setOpenSection(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] pt-[70px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full"
        />
        <p className="mt-4 text-slate-500 font-black uppercase tracking-widest text-xs animate-pulse">Loading freshness...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-[120px] pb-20 px-4 text-center">
        <div className="max-w-md mx-auto">
          <Info className="h-16 w-16 text-slate-300 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-slate-800 mb-4">Product Not Found</h2>
          <p className="text-slate-500 mb-8 font-medium">The product you're looking for might have been harvested or moved to a different pasture.</p>
          <button onClick={() => navigate('/services')} className="btn-premium bg-emerald-600 text-white w-full">
            Back to Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">

        {/* Breadcrumb / Back Navigation */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/services')}
          className="mb-12 flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-black text-xs uppercase tracking-widest group transition-all"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Store
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">

          {/* Left Column: Premium Gallery */}
          <div className="space-y-8">
            <div className="relative group aspect-square bg-slate-50 rounded-[3rem] overflow-hidden border border-slate-100 flex items-center justify-center p-12 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  src={selectedImage || "/images/placeholder-product.png"}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.src = "/images/placeholder-product.png";
                  }}
                  className="w-full h-full object-contain filter drop-shadow-2xl"
                />
              </AnimatePresence>

              {/* Image Badges */}
              <div className="absolute top-8 left-8 flex flex-col gap-3">
                <span className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                  <Leaf className="h-3 w-3" /> 100% Organic
                </span>
                {product.discount && (
                  <span className="bg-rose-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                    -{product.discount}% OFF
                  </span>
                )}
              </div>

              <div className="absolute bottom-8 right-8 flex gap-3">
                <button className="p-3 bg-white/80 backdrop-blur-md rounded-2xl text-slate-800 hover:bg-white hover:text-emerald-600 shadow-lg transition-all active:scale-95">
                  <Heart className="h-5 w-5" />
                </button>
                <button className="p-3 bg-white/80 backdrop-blur-md rounded-2xl text-slate-800 hover:bg-white hover:text-emerald-600 shadow-lg transition-all active:scale-95">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide py-2">
                {allImages.map((img, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-24 h-24 rounded-3xl border-2 overflow-hidden flex-shrink-0 transition-all p-2 bg-slate-50 ${selectedImage === img ? 'border-emerald-500 shadow-xl' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                  >
                    <img
                      src={img}
                      alt={`View ${idx}`}
                      onError={(e) => {
                        e.currentTarget.src = "/images/placeholder-product.png";
                      }}
                      className="w-full h-full object-contain"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Immersive Info */}
          <div className="space-y-10">
            <div>
              <span className="text-emerald-600 font-black text-xs uppercase tracking-[0.2em] mb-4 block">Product Category • {product.category || 'Fresh'}</span>
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">
                {product.name}
              </h1>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                {product.description || 'Our finest farm-picked selection, ensuring premium quality and peak ripeness for your table.'}
              </p>
            </div>

            {/* Price Card */}
            <div className="glass-card bg-slate-50/50 p-8 rounded-[2.5rem] border border-emerald-50 group">
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-5xl font-black text-slate-900 tracking-tighter">
                  ₹{product.price.toFixed(2)}
                </span>
                <div className="flex flex-col">
                  {product.mrp && product.price < product.mrp && (
                    <span className="text-xl text-slate-400 line-through font-bold">
                      ₹{product.mrp.toFixed(2)}
                    </span>
                  )}
                  {product.unitSize && (
                    <span className="text-xs font-black text-emerald-600 uppercase tracking-widest mt-1">
                      per {product.unitSize}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-emerald-600">
                <CheckCircle2 className="h-4 w-4" /> In Stock & Freshly Picked
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Modern Counter */}
                <div className="flex items-center bg-slate-100 rounded-3xl p-1.5 w-full sm:w-auto">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-slate-600 hover:bg-white hover:text-emerald-600 rounded-2xl shadow-sm transition-all font-black text-lg"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-14 text-center font-black text-slate-800 text-lg uppercase tracking-tighter">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center text-slate-600 hover:bg-white hover:text-emerald-600 rounded-2xl shadow-sm transition-all font-black text-lg"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAddToCart(false)}
                    className="btn-premium bg-white text-emerald-600 border-2 border-emerald-600 flex-1 h-14"
                  >
                    <ShoppingCart className="h-5 w-5" /> Add to Bag
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAddToCart(true)}
                    className="btn-premium bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 flex-1 h-14"
                  >
                    <Zap className="h-5 w-5 fill-current" /> Buy Now
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Feature Icons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: <Truck className="h-5 w-5" />, title: 'Fast Delivery', desc: 'Doorstep in 24h' },
                { icon: <Leaf className="h-5 w-5" />, title: 'Fresh Picked', desc: 'Sourced daily' },
                { icon: <ShieldCheck className="h-5 w-5" />, title: 'Assurance', desc: 'Quality checked' },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center sm:items-start p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-emerald-500/5 transition-all">
                  <div className="text-emerald-600 mb-3 bg-emerald-50 p-2.5 rounded-xl">{item.icon}</div>
                  <h4 className="font-black text-xs uppercase tracking-widest text-slate-800 mb-1">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 font-bold leading-tight">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Expandable Info Sections */}
            <div className="space-y-4 pt-10 border-t border-slate-100">
              {[
                { id: 'shelfLife', icon: <Calendar className="h-4 w-4" />, title: 'Shelf Life & Availability', content: product.shelfLife || 'Peak freshness for 1-2 weeks when properly stored in a cool environment.' },
                { id: 'healthBenefits', icon: <Heart className="h-4 w-4" />, title: 'Health Benefits', content: product.healthBenefits || 'Rich in natural antioxidants and essential nutrients tailored by nature.' },
                { id: 'storage', icon: <Info className="h-4 w-4" />, title: 'Storage Advice', content: product.storageAdvice || 'Keep in a dry, ventilated space. Refrigerate for extended crispness and flavor retention.' },
              ].map((section) => (
                <div key={section.id} className="group outline-none">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between py-6 border-b border-slate-100 group-focus:text-emerald-600 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg transition-colors ${openSection[section.id] ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-500'}`}>
                        {section.icon}
                      </div>
                      <span className="font-black text-sm uppercase tracking-widest text-slate-800">{section.title}</span>
                    </div>
                    <ChevronDown className={`h-5 w-5 text-slate-300 transition-transform duration-300 ${openSection[section.id] ? 'rotate-180 text-emerald-500' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openSection[section.id] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="py-6 text-slate-500 font-medium leading-relaxed text-sm">
                          {section.content}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Farmer/Manufacturer Info Header */}
            <div className="bg-slate-900 rounded-[2.5rem] p-10 mt-12 text-white">
              <h4 className="text-emerald-500 font-black text-xs uppercase tracking-widest mb-8">Traceability & Safety</h4>
              <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                <div>
                  <span className="block text-slate-500 font-black text-[10px] uppercase tracking-widest mb-2">Farmer / Origin</span>
                  <p className="font-bold text-sm tracking-tight">{product.farmerName || 'Partner Organic Farms, Maharashtra'}</p>
                </div>
                <div>
                  <span className="block text-slate-500 font-black text-[10px] uppercase tracking-widest mb-2">Safety Certification</span>
                  <p className="font-bold text-sm tracking-tight">FSSAI. {product.fssaiLicense || '1001234567890'}</p>
                </div>
                <div>
                  <span className="block text-slate-500 font-black text-[10px] uppercase tracking-widest mb-2">Marketed By</span>
                  <p className="font-bold text-sm tracking-tight">{product.marketedBy || 'AgriMart Retail Services Pvt Ltd'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border-2 border-emerald-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest leading-tight">Verified <br /> Quality</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </motion.div>
  );
};

export default ProductDetail;
