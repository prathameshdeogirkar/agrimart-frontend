import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, ArrowRight, Filter, Search, Loader2, ShoppingCart } from 'lucide-react';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import { toast } from 'react-hot-toast';

const ProductsDisplay = ({ category, categoryLabel, isAllProducts }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const { addToCart } = useCart();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get('search') || '';
  const [sort, setSort] = useState('id,desc');

  const categoryMap = {
    'essentials': 'Essentials',
    'vegetables': 'Vegetables',
    'fruits': 'Fruits',
    'exotics': 'Exotics',
    'dairy': 'Dairy'
  };

  useEffect(() => {
    setProducts([]);
    setPage(0);
    setHasMore(true);
  }, [category, searchQuery, sort]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let response;
        if (isAllProducts) {
          response = await productService.getAll(page, 8, searchQuery, sort);
          if (response.content) {
            setProducts(prev => page === 0 ? response.content : [...prev, ...response.content]);
            setHasMore(!response.last);
          } else {
            setProducts([]);
            setHasMore(false);
          }
        } else {
          response = await productService.getByCategory(categoryMap[category]);
          setProducts(response || []);
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        if (page === 0) setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, isAllProducts, page, searchQuery, sort]);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  if (loading && page === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="h-12 w-12 text-emerald-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold animate-pulse">Curating fresh products for you...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
            <Filter className="h-5 w-5" />
          </div>
          <div className="text-slate-600 font-bold">
            {searchQuery ? (
              <span>Found results for "<span className="text-emerald-600">{searchQuery}</span>"</span>
            ) : (
              <span>Showing {products.length} Products</span>
            )}
          </div>
        </div>

        {isAllProducts && (
          <div className="flex items-center gap-3 glass-card px-4 py-2 rounded-2xl">
            <label htmlFor="sort" className="text-xs font-black uppercase tracking-widest text-slate-400">Sort By</label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent border-none text-sm font-black text-slate-800 focus:ring-0 cursor-pointer"
            >
              <option value="id,desc">Newest First</option>
              <option value="price,asc">Price: Low to High</option>
              <option value="price,desc">Price: High to Low</option>
            </select>
          </div>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
        >
          {products.map((product, idx) => (
            <motion.div
              layout
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx % 8 * 0.1 }}
              whileHover={{ y: -8 }}
              className="glass-card bg-white rounded-[2.5rem] overflow-hidden group flex flex-col h-full hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500"
            >
              {/* Product Image Wrapper */}
              <div
                className="relative aspect-square bg-slate-50 overflow-hidden cursor-pointer"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-colors duration-500" />
                <img
                  src={product.imageUrl || "/images/placeholder-product.png"}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.src = "/images/placeholder-product.png";
                  }}
                  className="w-full h-full object-contain p-8 transform group-hover:scale-110 transition-transform duration-700"
                />

                {/* Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  {product.discount && (
                    <span className="bg-rose-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg">
                      -{product.discount}% OFF
                    </span>
                  )}
                  {idx < 2 && (
                    <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" /> Bestseller
                    </span>
                  )}
                </div>
              </div>

              {/* Product Content */}
              <div className="p-8 flex flex-col flex-grow bg-white">
                <div className="flex-grow">
                  <h3
                    className="font-black text-slate-800 text-xl mb-1 cursor-pointer group-hover:text-emerald-600 transition-colors leading-tight"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    {product.name}
                  </h3>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                    {product.unitSize || 'Standard Pack'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900 tracking-tight">
                        ₹{product.price}
                      </span>
                    </div>
                    {product.mrp && product.mrp > product.price && (
                      <span className="text-[10px] text-slate-400 line-through font-bold">
                        MRP ₹{product.mrp}
                      </span>
                    )}
                  </div>

                  {user && !isAdmin ? (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={async (e) => {
                        e.stopPropagation();
                        const result = await addToCart(product.id, 1);
                        if (result.success) {
                          toast.success('Added to bag!');
                        } else {
                          toast.error(result.error || 'Failed to add');
                        }
                      }}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all group/btn"
                    >
                      <ShoppingBag className="h-5 w-5" />
                    </motion.button>
                  ) : !user ? (
                    <button
                      onClick={() => navigate('/login')}
                      className="text-emerald-600 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
                    >
                      Login <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {isAllProducts && hasMore && (
        <div className="mt-20 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLoadMore}
            disabled={loading}
            className="btn-premium bg-white text-emerald-600 border-2 border-emerald-600 min-w-[200px]"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Explore More'}
          </motion.button>
        </div>
      )}
    </>
  );
};

const Services = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartItemCount } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const urlTerm = searchParams.get('search') || '';
    if (searchTerm !== urlTerm) {
      setSearchTerm(urlTerm);
    }
  }, [searchParams]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const urlTerm = searchParams.get('search') || '';
      if (searchTerm !== urlTerm) {
        navigate(`/services?search=${encodeURIComponent(searchTerm)}`, { replace: true });
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm, navigate, searchParams]);

  const categoryMap = {
    'essentials': 'Essentials',
    'vegetables': 'Vegetables',
    'fruits': 'Fruits',
    'exotics': 'Exotics',
    'dairy': 'Dairy'
  };

  useEffect(() => {
    const path = location.pathname.split('/').filter(Boolean)[1] || '';
    const category = Object.keys(categoryMap).find(key => key === path.toLowerCase());
    setSelectedCategory(category || 'all');
  }, [location.pathname]);

  const categories = [
    { id: 'all', label: 'All Products', path: '/services' },
    { id: 'essentials', label: 'Essentials', path: '/services/essentials' },
    { id: 'vegetables', label: 'Vegetables', path: '/services/vegetables' },
    { id: 'fruits', label: 'Fruits', path: '/services/fruits' },
    { id: 'exotics', label: 'Exotics', path: '/services/exotics' },
    { id: 'dairy', label: 'Dairy', path: '/services/dairy' }
  ];

  return (
    <div className="min-h-screen bg-emerald-50/30">
      {/* Premium Sub-Nav Filter Bar */}
      <div className="sticky top-[70px] z-40 bg-white/90 backdrop-blur-xl border-b border-emerald-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-8 h-12">
            {/* Category Scrollable List */}
            <div className="flex gap-2 sm:gap-4 overflow-x-auto scrollbar-hide flex-1 items-center">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    navigate(cat.path);
                    setSelectedCategory(cat.id);
                  }}
                  className={`whitespace-nowrap px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                    : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50'
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Interaction Group */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Find fresh produce..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 pr-4 py-2.5 bg-slate-100/50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 w-48 lg:w-72 text-sm font-bold transition-all placeholder:text-slate-400"
                />
              </div>

              <Link to="/cart" className="relative group">
                <div className="p-2.5 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                  <ShoppingCart className="h-5 w-5" />
                </div>
                {getCartItemCount() > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-lg"
                  >
                    {getCartItemCount()}
                  </motion.span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-emerald-600 font-black text-xs uppercase tracking-[0.2em] mb-4 block">Our Collection</span>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-none">
              {selectedCategory === 'all' ? (
                <>Fresh <span className="text-emerald-600">Harvest.</span></>
              ) : (
                <>{categoryMap[selectedCategory] || selectedCategory} <span className="text-emerald-600">Selection.</span></>
              )}
            </h1>
            <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
              {selectedCategory === 'all'
                ? 'Sourced daily from sustainable farms. Experience true quality in every bite.'
                : `Our premium selection of hand-picked ${categoryMap[selectedCategory]?.toLowerCase() || selectedCategory}.`}
            </p>
          </motion.div>
        </header>

        <ProductsDisplay
          category={selectedCategory === 'all' ? null : selectedCategory}
          categoryLabel={selectedCategory === 'all' ? 'All Products' : categoryMap[selectedCategory]}
          isAllProducts={selectedCategory === 'all'}
        />
      </div>

      <Footer />
    </div>
  );
};

export default Services;

