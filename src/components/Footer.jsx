import { Link } from 'react-router-dom';
import { Instagram, Twitter, Mail, MapPin, Phone, Github, Leaf } from 'lucide-react';

const Footer = () => {
  const socialMediaLinks = [
    { icon: <Instagram className="h-5 w-5" />, alt: 'Instagram', href: 'https://www.instagram.com/agrimart20/' },
    { icon: <Twitter className="h-5 w-5" />, alt: 'Twitter', href: 'https://x.com/Agrimart3' },
    { icon: <Mail className="h-5 w-5" />, alt: 'Gmail', href: 'mailto:agrimart@gmail.com' },
  ];

  const contactInfo = [
    { icon: <MapPin className="h-5 w-5" />, text: 'Agromart, Pune, India', href: 'https://maps.app.goo.gl/PjnAu7sv8ukzt1xb8' },
    { icon: <Phone className="h-5 w-5" />, text: '+91 91453 68876', href: 'tel:9145368876' },
    { icon: <Mail className="h-5 w-5" />, text: 'contact@agrimart.com', href: 'mailto:agrimart@gmail.com' },
  ];

  const footerRoutes = [
    { path: '/about', name: 'About AgriMart' },
    { path: '/services', name: 'Our Services' },
    { path: '/blog', name: 'Latest News' },
    { path: '/feedback', name: 'Feedback' },
  ];

  const categories = [
    { name: 'Essentials', href: '/services' },
    { name: 'Fresh Vegetables', href: '/services' },
    { name: 'Organic Fruits', href: '/services' },
    { name: 'Exotic Greens', href: '/services' },
    { name: 'Dairy Products', href: '/services' },
  ];

  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-slate-800">
        {/* Brand Section */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-emerald-600 p-2 rounded-xl transition-transform group-hover:rotate-12">
              <Leaf className="h-6 w-6" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              Agri<span className="text-emerald-500">Mart</span>
            </span>
          </Link>
          <p className="text-slate-400 font-medium leading-relaxed max-w-sm">
            Revolutionizing the way you shop for farm-fresh products. Connecting local farmers directly to your kitchen since 2024.
          </p>
          <div className="flex gap-4">
            {socialMediaLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition-all duration-300 transform hover:-translate-y-1"
                aria-label={link.alt}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Categories Section */}
        <div>
          <h4 className="text-lg font-black mb-8 uppercase tracking-widest text-emerald-500">Categories</h4>
          <ul className="space-y-4 list-none p-0">
            {categories.map((cat, index) => (
              <li key={index}>
                <Link to={cat.href} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 font-bold text-sm">
                  <span className="h-1 w-1 bg-emerald-500 rounded-full" />
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company Section */}
        <div>
          <h4 className="text-lg font-black mb-8 uppercase tracking-widest text-emerald-500">Company</h4>
          <ul className="space-y-4 list-none p-0">
            {footerRoutes.map((item, index) => (
              <li key={index}>
                <Link to={item.path} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 font-bold text-sm">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h4 className="text-lg font-black mb-8 uppercase tracking-widest text-emerald-500">Get in Touch</h4>
          <ul className="space-y-6 list-none p-0">
            {contactInfo.map((info, idx) => (
              <li key={idx}>
                <a href={info.href} className="flex items-start gap-4 text-slate-400 hover:text-white group transition-colors">
                  <div className="bg-slate-800 p-2 rounded-lg group-hover:bg-emerald-600/20 group-hover:text-emerald-500 transition-colors">
                    {info.icon}
                  </div>
                  <span className="text-sm font-bold leading-relaxed">{info.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-slate-500 text-sm font-bold">
          &copy; {new Date().getFullYear()} AgriMart Organic. All rights reserved.
        </p>
        <div className="flex gap-8 text-xs font-black uppercase tracking-widest text-slate-500">
          <Link to="/privacy" className="hover:text-emerald-500 transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-emerald-500 transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

