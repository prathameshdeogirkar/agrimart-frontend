import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FruitsCard = ({ title, imgSrc, description, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="glass-card p-4 md:p-8 rounded-[2rem] md:rounded-[2.5rem] flex flex-col items-center text-center gap-4 md:gap-6 group relative overflow-hidden w-full h-full justify-between"
    >
      <div className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 bg-emerald-500/5 rounded-full -mr-6 -mt-6 md:-mr-8 md:-mt-8 group-hover:scale-150 transition-transform duration-500" />

      <div className="relative mt-2">
        <div className="bg-emerald-50 rounded-full p-3 md:p-4 group-hover:bg-emerald-100 transition-colors duration-300">
          <img
            src={imgSrc}
            alt={title}
            className="w-20 h-20 md:w-32 md:h-32 object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-lg"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/160x160?text=' + title;
            }}
          />
        </div>
      </div>

      <div className="space-y-1 md:space-y-2 flex-grow">
        <h3 className="text-lg md:text-2xl font-black text-slate-800 tracking-tight">{title}</h3>
        <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>

      <Link
        to="/services"
        className="flex items-center gap-1 md:gap-2 text-emerald-600 font-black text-[10px] md:text-xs uppercase tracking-widest hover:gap-2 md:hover:gap-3 transition-all mt-auto"
      >
        Shop Now <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
      </Link>
    </motion.div>
  );
};

const FruitsCards = () => {
  const fruitsData = [
    {
      title: 'Pear',
      imgSrc: '/images/card3/pear.png',
      description: 'Juicy, sweet, and packed with fiber. A perfect healthy snack for any time.',
    },
    {
      title: 'Grapes',
      imgSrc: '/images/card3/grape.png',
      description: 'Bite-sized bursts of freshness. Ideal for snacking or gourmet platters.',
    },
    {
      title: 'Peach',
      imgSrc: '/images/card3/peach.png',
      description: 'Velvety skin and luscious flavor. The gold standard of summer fruits.',
    },
    {
      title: 'Apple',
      imgSrc: '/images/card3/apple.png',
      description: 'Crisp, refreshing, and classic. The ultimate farm-to-table essential.',
    },
  ];

  return (
    <section className="py-10 md:py-20 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {fruitsData.map((fruit, index) => (
          <FruitsCard key={index} {...fruit} index={index} />
        ))}
      </div>
    </section>
  );
};

export default FruitsCards;


