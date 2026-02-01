import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Tag } from 'lucide-react';

const Card3 = ({ image, description, link }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="relative group w-full max-w-[350px] aspect-[350/250] overflow-visible mx-auto"
    >
      {/* Background Blobs */}
      <div className="absolute inset-0 bg-emerald-50 rounded-[2.5rem] transition-all duration-300 group-hover:bg-emerald-100/50 group-hover:shadow-2xl group-hover:shadow-emerald-500/10" />

      <div className="relative z-10 h-full p-6 md:p-8 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <Tag className="h-3 w-3 md:h-4 md:w-4" />
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Special Deal</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight">
            Healthy <br /> <span className="text-emerald-600">Choices.</span>
          </h2>
          <p className="text-xs md:text-sm font-bold text-slate-500 mt-2">
            Get special discount on <br />
            <span className="text-slate-700 italic">{description}</span>
          </p>
        </div>

        <Link
          to={link || '/services'}
          className="btn-premium bg-emerald-600 text-white w-fit px-4 py-1.5 md:px-5 md:py-2 text-[10px] md:text-xs group-hover:gap-3"
        >
          Know More <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
        </Link>
      </div>

      <div className="absolute -right-6 -bottom-3 w-32 h-32 md:-right-8 md:-bottom-4 md:w-48 md:h-48 drop-shadow-2xl transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110 pointer-events-none">
        <img
          src={image}
          alt={description}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
    </motion.div>
  );
};

export default Card3;
