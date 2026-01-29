import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Tag } from 'lucide-react';

const Card3 = ({ image, description, link }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="relative group w-[350px] h-[250px] overflow-visible"
    >
      {/* Background Blobs */}
      <div className="absolute inset-0 bg-emerald-50 rounded-[2.5rem] transition-all duration-300 group-hover:bg-emerald-100/50 group-hover:shadow-2xl group-hover:shadow-emerald-500/10" />

      <div className="relative z-10 h-full p-8 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <Tag className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Special Deal</span>
          </div>
          <h2 className="text-3xl font-black text-slate-800 leading-tight">
            Healthy <br /> <span className="text-emerald-600">Choices.</span>
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-2">
            Get special discount on <br />
            <span className="text-slate-700 italic">{description}</span>
          </p>
        </div>

        <Link
          to={link || '/services'}
          className="btn-premium bg-emerald-600 text-white w-fit px-5 py-2 text-xs group-hover:gap-3"
        >
          Know More <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="absolute -right-8 -bottom-4 w-48 h-48 drop-shadow-2xl transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110 pointer-events-none">
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
