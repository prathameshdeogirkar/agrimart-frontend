import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, LogIn, ArrowRight,
  ShieldCheck, Loader2, Sparkles, UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      toast.success('Welcome back to AgriMart!');
      navigate('/');
    } else {
      setError(result.error);
      toast.error(result.error || 'Identity verification failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-stretch overflow-hidden">
      {/* Left Column: Premium Branding (Desktop Only) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center p-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop"
            alt="Organic produce"
            className="w-full h-full object-cover opacity-20 scale-110 blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-transparent to-slate-900" />
        </div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10 text-center max-w-lg"
        >
          <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-3xl shadow-emerald-500/20 rotate-12">
            <span className="text-4xl">🌱</span>
          </div>
          <h1 className="text-6xl font-black text-white mb-6 tracking-tighter">
            Access the <br /> <span className="text-emerald-500 text-7xl">Harvest.</span>
          </h1>
          <p className="text-slate-400 text-xl font-medium leading-relaxed">
            The standard in sustainable farming. Log in to manage your orders, harvest points, and profile.
          </p>

          <div className="mt-12 flex items-center justify-center gap-8 border-t border-slate-800 pt-12">
            <div className="text-center">
              <p className="text-white font-black text-2xl">500+</p>
              <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Farmers</p>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center">
              <p className="text-white font-black text-2xl">100%</p>
              <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Organic</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Column: SaaS Style Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-24 relative bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Header Mobile Only */}
          <div className="lg:hidden text-center mb-12">
            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🌱</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome back</h2>
            <p className="text-slate-500 font-bold mt-2">Log in to your account</p>
          </div>

          <div className="mb-10 lg:block hidden">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-4">Member Log In</h2>
            <p className="text-slate-400 font-black text-xs uppercase tracking-[0.2em]">AgriMart Integrated Platform</p>
          </div>

          <div className="flex gap-1 mb-10 bg-slate-100 p-1 rounded-2xl relative">
            <div className="absolute top-1 left-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm z-0" />
            <Link to="/login" className="flex-1 text-center py-2.5 relative z-10 text-xs font-black uppercase tracking-widest text-emerald-600 pointer-events-none">
              Login
            </Link>
            <Link to="/register" className="flex-1 text-center py-2.5 relative z-10 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">
              Registration
            </Link>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-rose-50 border border-rose-100 p-4 rounded-2xl mb-8 flex items-start gap-3"
              >
                <div className="mt-0.5 text-rose-500">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <p className="text-rose-600 text-xs font-black uppercase tracking-widest leading-relaxed">
                  {error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mb-8">
            <button
              type="button"
              onClick={() => window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`}
              className="w-full h-14 bg-white border-2 border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 text-slate-700 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
              />
              <span className="tracking-wide">Sign in with Google</span>
            </button>

            <div className="flex items-center gap-4 mt-6">
              <div className="h-px bg-slate-100 flex-1" />
              <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Or continue with email</span>
              <div className="h-px bg-slate-100 flex-1" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder="e.g. prathamesh@agrimart.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-bold transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Password</label>
                <Link to="/forgot-password" disabled className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 hover:text-emerald-500 opacity-50 cursor-not-allowed">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-bold transition-all placeholder:text-slate-300 shadow-sm"
                />
              </div>
            </div>

            <div className="pt-6">
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full h-16 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Verifying...
                  </>
                ) : (
                  <>
                    Sign In <LogIn className="h-4 w-4" />
                  </>
                )}
              </motion.button>
            </div>

            <div className="mt-10 pt-10 border-t border-slate-100 text-center">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-colors text-[10px] font-black uppercase tracking-widest group"
              >
                No account yet? <UserPlus className="h-3 w-3" /> <span className="text-emerald-600 group-hover:underline">Create Harvest Identity</span> <ArrowRight className="h-3 w-3 translate-x-0 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </form>

          {/* Trust Footer */}
          <div className="mt-24 lg:mt-32 text-center flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
              <ShieldCheck className="h-4 w-4" /> Secure Harvest Access
            </div>
            <p className="text-[10px] text-slate-300 font-bold leading-relaxed max-w-[240px]">
              By signing in you agree to our Terms of Nature and Privacy Soil policy.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
