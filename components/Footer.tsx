import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, FileText } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & About Summary */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-brand-600 text-white p-1.5 rounded-lg shadow-lg shadow-brand-500/20">
                <FileText size={20} strokeWidth={2.5} />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">PDF Tool Box</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Your comprehensive suite of free, privacy-first online tools. Process files directly in your browser with no limits.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-6">Product</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/tools/pdf" className="hover:text-brand-400 transition-colors">PDF Tools</Link></li>
              <li><Link to="/tools/image" className="hover:text-brand-400 transition-colors">Image Tools</Link></li>
              <li><Link to="/tools/text" className="hover:text-brand-400 transition-colors">Text Tools</Link></li>
              <li><Link to="/tools/daily" className="hover:text-brand-400 transition-colors">Daily Utilities</Link></li>
              <li><Link to="/tools/student" className="hover:text-brand-400 transition-colors">Student Hub</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
             <h3 className="font-semibold text-white mb-6">Company & Legal</h3>
             <ul className="space-y-3 text-sm">
               <li><Link to="/legal" className="hover:text-brand-400 transition-colors">About Us</Link></li>
               <li><Link to="/legal#policies" className="hover:text-brand-400 transition-colors">Privacy Policy</Link></li>
               <li><Link to="/legal#policies" className="hover:text-brand-400 transition-colors">Terms of Service</Link></li>
               <li><Link to="/legal#policies" className="hover:text-brand-400 transition-colors">Cookie Policy</Link></li>
               <li><a href="mailto:support@toolbox.app" className="hover:text-brand-400 transition-colors">Contact Support</a></li>
             </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-white mb-6">Stay Updated</h3>
            <p className="text-sm text-slate-400 mb-4">Get the latest tools and updates directly to your inbox.</p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter email" 
                className="bg-slate-800 border-none text-white text-sm rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-brand-500 placeholder-slate-500"
              />
              <button className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors text-sm">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>
            © {new Date().getFullYear()} PDF Tool Box Inc. All rights reserved.
          </p>
          <div className="flex items-center">
            <span>Made by </span>
            <Heart size={14} className="mx-1 text-red-500 fill-red-500 animate-pulse" />
            <span>Hexa Shield</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
