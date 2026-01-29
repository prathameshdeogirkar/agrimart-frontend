import { motion } from 'framer-motion';
import {
  Sprout, Users, ShieldCheck, Truck,
  Heart, Globe, Zap, Award, ArrowRight,
  Leaf, Sun, Droplets, MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const About = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const staggeredContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { staggerChildren: 0.2 }
  };

  return (
    <div className="min-h-screen bg-emerald-50/20 pt-[72px]">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-slate-900 px-4">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=2070&auto=format&fit=crop"
            alt="Farm background"
            className="w-full h-full object-cover opacity-30 grayscale-[0.2]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl text-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 rounded-full bg-emerald-600/20 text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em] mb-6 border border-emerald-600/30"
          >
            Organic Since 2024
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-none"
          >
            We are <span className="text-emerald-500">AgriMart.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Bridge the gap between pure nature and your home. We're on a mission to bring sustainable, farm-fresh organic produce to every doorstep.
          </motion.p>
        </div>
      </section>

      {/* Mission & Purpose */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div {...fadeIn}>
            <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">Our <span className="text-emerald-600">Pure Purpose.</span></h2>
            <div className="space-y-6 text-slate-600 text-lg font-medium leading-relaxed">
              <p>
                Founded on the belief that everyone deserves access to high-quality, chemical-free food, AgriMart works directly with local farmers who share our passion for soil health and clean eating.
              </p>
              <p>
                We don't just sell produce; we curate a lifecycle of transparency. From the moment a seed is planted to the hour it's delivered to you, we ensure every step respects the earth and your health.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-emerald-100 rounded-[3rem] blur-2xl opacity-50 z-0" />
            <img
              src="https://images.unsplash.com/photo-1595855759920-86582396756a?q=80&w=1964&auto=format&fit=crop"
              alt="Farmer holding produce"
              className="relative z-10 w-full h-[500px] object-cover rounded-[3rem] shadow-2xl border border-white"
            />
          </motion.div>
        </div>
      </section>

      {/* Why AgriMart Grid */}
      <section className="py-24 bg-white border-y border-emerald-100 px-4">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Why <span className="text-emerald-600">AgriMart?</span></h2>
          <p className="text-slate-500 font-medium">The standard in sustainable grocery experiences.</p>
        </div>

        <motion.div
          variants={staggeredContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            { icon: <Leaf />, title: "100% Organic", desc: "No chemical pesticides or synthetic fertilizers. Just pure growth." },
            { icon: <Users />, title: "Local Farmers", desc: "Supporting over 500+ small-scale farm families across the region." },
            { icon: <Droplets />, title: "Eco-Harvest", desc: "Sustainable irrigation and soil rotation for long-term planetary health." },
            { icon: <ShieldCheck />, title: "Quality Lab", desc: "Every batch is tested for nutritional value and chemical traces." },
            { icon: <Truck />, title: "Express Logistics", desc: "Smart route optimization to deliver within 12-24 hours of harvest." },
            { icon: <Award />, title: "Premium Pricing", desc: "Fair rates for farmers and affordable luxury for your family." }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              variants={fadeIn}
              className="glass-card p-10 rounded-[3rem] border border-slate-50 hover:border-emerald-200 transition-all group"
            >
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                {item.icon}
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">{item.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How it Works (Timeline/Steps) */}
      <section className="py-24 px-4 bg-emerald-50/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Simple <span className="text-emerald-600">Journey.</span></h2>
            <p className="text-slate-500 font-medium">Freshness at the speed of nature.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            <div className="hidden md:block absolute top-[2.75rem] left-[10%] right-[10%] h-px bg-emerald-200 z-0" />

            {[
              { step: "01", icon: <Sprout />, label: "Order Placed", desc: "You select from our seasonal curated daily harvest." },
              { step: "02", icon: <Sun />, label: "Sunrise Harvest", desc: "Farmers pick your specific items at the peak of ripeness." },
              { step: "03", icon: <Zap />, label: "Flash Sort", desc: "Rapid cooling and eco-packaging at our local hubs." },
              { step: "04", icon: <MapPin />, label: "Last Mile", desc: "Arrives at your door within hours, not days." }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                {...fadeIn}
                transition={{ delay: idx * 0.1 }}
                className="relative z-10 flex flex-col items-center text-center p-6"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-sm mb-6 shadow-xl shadow-emerald-600/20">
                  {step.icon}
                </div>
                <h4 className="text-lg font-black text-slate-900 mb-2">{step.label}</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{step.desc}</p>
                <span className="absolute top-0 right-0 text-slate-100 font-black text-6xl -z-10">{step.step}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto bg-slate-900 rounded-[4rem] p-12 md:p-20 text-center text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-20 opacity-10">
            <Heart className="w-64 h-64 text-emerald-500" />
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter">Ready for better <br /><span className="text-emerald-500">groceries?</span></h2>
            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12">
              Join thousands of families who have switched to a cleaner, more sustainable way of eating. Start your harvest journey today.
            </p>
            <Link
              to="/services"
              className="h-16 px-10 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-black text-xs uppercase tracking-widest inline-flex items-center gap-3 shadow-2xl shadow-emerald-500/20 transition-all"
            >
              Shop the Harvest <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
