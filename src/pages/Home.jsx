import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Section1 from '../components/Section1';
import FruitsCards from '../components/FruitsCards';
import Card3 from '../components/Card3';
import Footer from '../components/Footer';
import { ArrowRight, Leaf, Sparkles, ShieldCheck } from 'lucide-react';

const card3Data = [
  {
    image: '/images/card3/brocoli.png',
    description: 'Fresh & Organic Broccoli',
    link: '/services',
  },
  {
    image: '/images/card3/straw.png',
    description: 'Sweet Farm Strawberries',
    link: '/services',
  },
  {
    image: '/images/card3/lettuce.png',
    description: 'Crispy Garden Lettuce',
    link: '/services',
  },
];

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="overflow-x-hidden"
    >
      {/* Premium Hero Section */}
      <div className="relative w-full h-screen flex justify-center items-center overflow-hidden">
        {/* Animated Background Overlay */}
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: 'url(https://cdn.pixabay.com/photo/2024/04/20/11/47/ai-generated-8708404_1280.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 z-10" />

        <div className="relative z-20 text-center px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-[0.2em] mb-6 backdrop-blur-md border border-emerald-500/30">
              <Sparkles className="h-3 w-3" /> Best Organic Store
            </span>
            <h1 className="text-6xl md:text-8xl font-black mb-6 text-white leading-tight drop-shadow-xl">
              Freshness <br />
              <span className="text-emerald-400">Redefined.</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-gray-200 font-medium max-w-2xl mx-auto leading-relaxed">
              Experience the true taste of nature with our farm-fresh organic products, delivered directly to your doorstep.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/services" className="btn-premium bg-emerald-600 hover:bg-emerald-500 text-white min-w-[200px] text-lg">
                Shop Now <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/about" className="btn-premium bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/30 min-w-[200px] text-lg">
                Our Story
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Decorative Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute bottom-10 left-10 z-20 hidden lg:block"
        >
          <div className="glass-card p-4 rounded-3xl flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">100% Organic</p>
              <p className="text-xs text-slate-500">Certified Quality</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modern Highlight Section */}
      <Section1 />

      {/* Why Choose Us Section - Overhauled */}
      <section className="py-24 bg-emerald-50/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card bg-white p-12 md:p-20 rounded-[3rem] relative overflow-hidden"
          >
            {/* Decorative Background Icon */}
            <Leaf className="absolute -top-10 -right-10 h-64 w-64 text-emerald-50 opacity-10 rotate-12" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <span className="text-emerald-600 font-black text-sm uppercase tracking-widest mb-4 block">Sustainability First</span>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 leading-tight">
                Why Choose <span className="text-emerald-600">AgriMart</span> ?
              </h2>
              <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed mb-12">
                By building a culture of sustainability and wholesome living, we strive for a healthier you and a healthier planet. We bridge the gap between hard-working farmers and your dinner table.
              </p>
              <Link to="/about" className="btn-premium bg-emerald-600 text-white inline-flex mx-auto">
                Know More <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products/Categories */}
      <FruitsCards />

      {/* Quick Access Cards */}
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-wrap justify-center gap-10">
        {card3Data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Card3 image={item.image} description={item.description} link={item.link} />
          </motion.div>
        ))}
      </div>

      <Footer />
    </motion.div>
  );
};

export default Home;
