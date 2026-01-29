import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, Menu, X, ChevronDown, Settings, Package, UserCircle, LogOut, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, role } = useAuth();
  const { getCartItemCount } = useCart();
  const [menuActive, setMenuActive] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
    setMenuActive(false);
  };

  const headerdata = [
    { to: '/', name: 'Home' },
    { to: '/services', name: 'Services' },
    { to: '/about', name: 'About' },
    { to: '/blog', name: 'Blog' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ${isScrolled ? 'glass-nav py-2 px-4 md:px-12' : 'bg-transparent py-4 px-4 md:px-8'
        }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-shrink-0"
        >
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="bg-emerald-600 p-2 rounded-xl transition-transform group-hover:rotate-12">
              <span className="text-2xl">🌱</span>
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-800 drop-shadow-sm">
              Agri<span className="text-emerald-600">Mart</span>
            </span>
          </NavLink>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6 list-none m-0 p-0">
            {headerdata.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <NavLink
                  to={item.to}
                  className={({ isActive }) => `
                    relative text-sm font-bold tracking-wide transition-all duration-300
                    ${isActive ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-500'}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {item.name}
                      {isActive && (
                        <motion.div
                          layoutId="nav-underline"
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-600 rounded-full"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </motion.li>
            ))}
          </ul>

          <div className="h-6 w-px bg-slate-200" />

          {/* Icons & Actions */}
          <div className="flex items-center gap-4">
            {/* Cart Icon */}
            <NavLink to="/cart" className="relative p-2 text-slate-600 hover:text-emerald-600 transition-colors group">
              <ShoppingBag className="h-6 w-6" />
              {getCartItemCount() > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 h-5 w-5 bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white"
                >
                  {getCartItemCount()}
                </motion.span>
              )}
            </NavLink>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                onMouseEnter={() => setShowUserDropdown(true)}
                className="flex items-center gap-2 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 px-4 py-2 rounded-2xl transition-all duration-300 font-bold text-sm"
              >
                <UserCircle className="h-5 w-5" />
                {user ? (user.email.split('@')[0]) : 'Account'}
                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showUserDropdown ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showUserDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    onMouseEnter={() => setShowUserDropdown(true)}
                    onMouseLeave={() => setShowUserDropdown(false)}
                    className="absolute right-0 mt-2 w-64 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden z-50 p-2"
                  >
                    {user ? (
                      <div className="flex flex-col gap-1">
                        <div className="px-4 py-3 bg-slate-50 rounded-xl mb-1">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Signed in as</p>
                          <p className="text-sm font-black text-slate-800 truncate">{user.email}</p>
                          <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${role === 'ADMIN' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {role === 'ADMIN' ? '👑 Admin' : '👤 User'}
                          </span>
                        </div>

                        {role === 'ADMIN' && (
                          <>
                            <DropdownLink to="/admin/products" icon={<Settings className="h-4 w-4" />} label="Manage Inventory" />
                            <DropdownLink to="/admin/orders" icon={<Package className="h-4 w-4" />} label="Manage Orders" />
                            <div className="h-px bg-slate-100 my-1 mx-2" />
                          </>
                        )}

                        <DropdownLink to="/profile" icon={<User className="h-4 w-4" />} label="My Account" />
                        <DropdownLink to="/orders" icon={<ShoppingBag className="h-4 w-4" />} label="Order History" />

                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-bold text-sm w-full text-left mt-1"
                        >
                          <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <DropdownLink to="/login" icon={<LogIn className="h-4 w-4" />} label="Sign In" />
                        <DropdownLink to="/register" icon={<UserPlus className="h-4 w-4" />} label="Created Account" />
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile Buttons */}
        <div className="md:hidden flex items-center gap-4">
          <NavLink to="/cart" className="relative p-2 text-slate-600">
            <ShoppingBag className="h-6 w-6" />
            {getCartItemCount() > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                {getCartItemCount()}
              </span>
            )}
          </NavLink>
          <button onClick={toggleMenu} className="p-2 text-slate-600 hover:bg-emerald-50 rounded-xl transition-colors">
            {menuActive ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuActive && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 top-[70px] bg-white z-[999] p-6 flex flex-col gap-8 md:hidden"
          >
            <ul className="flex flex-col gap-4 list-none p-0 m-0">
              {headerdata.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.to}
                    onClick={() => setMenuActive(false)}
                    className={({ isActive }) => `
                      text-2xl font-black py-2 block
                      ${isActive ? 'text-emerald-600' : 'text-slate-400'}
                    `}
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="mt-auto flex flex-col gap-4">
              {user ? (
                <>
                  <div className="p-4 bg-emerald-50 rounded-2xl">
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Signed in as</p>
                    <p className="text-lg font-black text-slate-800 truncate">{user.email}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${role === 'ADMIN' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {role === 'ADMIN' ? '👑 Admin' : '👤 User'}
                    </span>
                  </div>

                  {role === 'ADMIN' && (
                    <>
                      <NavLink to="/admin/products" onClick={() => setMenuActive(false)} className="btn-premium bg-slate-100 text-slate-800">
                        <Settings className="h-5 w-5" /> Manage Inventory
                      </NavLink>
                      <NavLink to="/admin/orders" onClick={() => setMenuActive(false)} className="btn-premium bg-slate-100 text-slate-800">
                        <Package className="h-5 w-5" /> Manage Orders
                      </NavLink>
                    </>
                  )}

                  <NavLink to="/profile" onClick={() => setMenuActive(false)} className="btn-premium bg-slate-100 text-slate-800">
                    <User className="h-5 w-5" /> My Account
                  </NavLink>
                  <NavLink to="/orders" onClick={() => setMenuActive(false)} className="btn-premium bg-slate-100 text-slate-800">
                    <ShoppingBag className="h-5 w-5" /> Order History
                  </NavLink>
                  <button onClick={handleLogout} className="btn-premium bg-red-600 text-white">
                    <LogOut className="h-5 w-5" /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" onClick={() => setMenuActive(false)} className="btn-premium bg-emerald-600 text-white">
                    <LogIn className="h-5 w-5" /> Sign In
                  </NavLink>
                  <NavLink to="/register" onClick={() => setMenuActive(false)} className="btn-premium bg-slate-100 text-slate-800">
                    <UserPlus className="h-5 w-5" /> Create Account
                  </NavLink>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const DropdownLink = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all duration-200 font-bold text-sm"
  >
    {icon}
    {label}
  </NavLink>
);

export default Navbar;
