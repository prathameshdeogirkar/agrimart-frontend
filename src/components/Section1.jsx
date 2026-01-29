import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, Dog, Carrot, Wheat, Flower2, Tractor } from 'lucide-react';

const Appcard1data = [
  { icon: <Sprout className="h-8 w-8 text-emerald-600" />, text1: 'Organic', text2: 'Farming' },
  { icon: <Dog className="h-8 w-8 text-emerald-600" />, text1: 'Different', text2: 'Livestock' },
  { icon: <Carrot className="h-8 w-8 text-emerald-600" />, text1: 'Fresh', text2: 'Vegetables' },
  { icon: <Wheat className="h-8 w-8 text-emerald-600" />, text1: 'Farm', text2: 'Fresh' },
  { icon: <Flower2 className="h-8 w-8 text-emerald-600" />, text1: 'Beautiful', text2: 'Flowers' },
  { icon: <Tractor className="h-8 w-8 text-emerald-600" />, text1: 'Modern', text2: 'Equipment' },
];

const Section1 = () => {
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-12 items-center mb-20">
        <div className="flex-1 text-center md:text-left">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-slate-800 mb-6 font-cursive"
          >
            Agrimart Farm Fresh Products
          </motion.h2>
        </div>
        <div className="flex-[1.5] space-y-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-slate-700 font-bold leading-relaxed border-l-4 border-emerald-500 pl-6"
          >
            Fresh agri products bring the goodness of nature straight to your table, ensuring quality, nutrition, and flavor in every bite.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 font-medium leading-relaxed pl-6"
          >
            Our platform connects you directly with local farmers, offering a curated selection of farm-fresh organic products delivered straight to your door. We ensure transparency, sustainability, and fair pricing for both producers and consumers.
          </motion.p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {Appcard1data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -10 }}
            className="glass-card p-8 rounded-[2rem] flex flex-col items-center justify-center text-center gap-4 group transition-all duration-300 hover:bg-emerald-600"
          >
            <div className="p-4 bg-emerald-50 rounded-2xl group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300 group-hover:text-white">
              {item.icon}
            </div>
            <p className="font-black text-sm text-slate-800 group-hover:text-white transition-colors tracking-tight">
              {item.text1} <br />
              <span className="text-emerald-600 group-hover:text-emerald-200">{item.text2}</span>
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Section1;


