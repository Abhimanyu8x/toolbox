import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Type, Image as ImageIcon, GraduationCap, Shield, Zap, Lock, Calculator, ArrowRight, Star, Clock } from 'lucide-react';
import ToolCard from '../components/ToolCard';
import { useRecentTools } from '../hooks/useRecentTools';
import { allTools } from '../data/tools';

const Home: React.FC = () => {
  const { recentTools } = useRecentTools();

  // Filter popular tools from the centralized list for consistency
  const popularTools = allTools.filter(t => 
    ['/tools/pdf-merge', '/tools/age-calculator', '/tools/image-to-pdf', '/tools/password-generator', '/tools/word-counter', '/tools/exam-timer'].includes(t.path)
  );

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-950 -z-10"></div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-200/30 rounded-full blur-3xl dark:bg-brand-900/20"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl dark:bg-purple-900/20"></div>

        <div className="text-center max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300 text-sm font-medium mb-6 animate-fade-in border border-brand-100 dark:border-brand-800">
            <Star size={14} className="fill-current" />
            <span>v2.0 is now live</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 animate-slide-up">
            Every tool you need,<br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-purple-600">right in your browser.</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{animationDelay: '0.1s'}}>
            Free, fast, and secure utilities for PDFs, images, text, and daily calculations. 
            No sign-up required, file processing happens 100% on your device.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up" style={{animationDelay: '0.2s'}}>
            <Link to="/tools/pdf" className="px-8 py-4 rounded-full bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/25 hover:-translate-y-1">
              Browse PDF Tools
            </Link>
            <Link to="/tools/daily" className="px-8 py-4 rounded-full bg-white text-slate-700 font-semibold border border-slate-200 hover:border-brand-300 hover:text-brand-600 transition-all shadow-sm hover:shadow-md hover:-translate-y-1 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
              Try Daily Tools
            </Link>
          </div>
        </div>
      </section>

      {/* Recently Used Section */}
      {recentTools.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="text-brand-500" size={24} />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recently Used</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentTools.map((tool) => (
              <ToolCard key={tool.path} {...tool} />
            ))}
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
           <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Explore Categories</h2>
           <p className="text-slate-500 dark:text-slate-400 mt-2">Find exactly what you are looking for</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: 'PDF Tools', icon: FileText, path: '/tools/pdf', color: 'bg-red-50 text-red-600 dark:bg-red-900/20' },
            { name: 'Text Tools', icon: Type, path: '/tools/text', color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' },
            { name: 'Image Tools', icon: ImageIcon, path: '/tools/image', color: 'bg-green-50 text-green-600 dark:bg-green-900/20' },
            { name: 'Daily Tools', icon: Calculator, path: '/tools/daily', color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20' },
            { name: 'Student Hub', icon: GraduationCap, path: '/tools/student', color: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20' },
            { name: 'Security', icon: Lock, path: '/tools/daily', color: 'bg-slate-50 text-slate-600 dark:bg-slate-800' },
            { name: 'Converters', icon: Zap, path: '/tools/daily', color: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20' },
            { name: 'View All', icon: ArrowRight, path: '/tools/pdf', color: 'bg-brand-50 text-brand-600 dark:bg-brand-900/20' },
          ].map((cat) => (
            <Link key={cat.name} to={cat.path} className="group p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-brand-200 dark:hover:border-brand-800 hover:shadow-xl hover:shadow-brand-900/5 transition-all duration-300">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${cat.color} transition-transform group-hover:scale-110`}>
                <cat.icon size={24} />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Tools Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Popular Tools</h2>
          <Link to="/tools/pdf" className="text-brand-600 hover:text-brand-700 font-medium text-sm flex items-center gap-1">View all tools <ArrowRight size={16} /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularTools.map((tool) => (
            <ToolCard key={tool.path} {...tool} />
          ))}
        </div>
      </section>

      {/* Features / Benefits */}
      <section className="bg-white dark:bg-slate-800 py-20 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Lock size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Privacy First</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Files never leave your device. All processing happens locally in your browser, ensuring 100% data privacy.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Lightning Fast</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                No queue, no upload time, no server latency. Tools run instantly powered by your device's processor.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Completely Free</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Access all professional tools without subscriptions, paywalls, or hidden fees. Forever free.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Block */}
      <section className="max-w-4xl mx-auto px-4 pb-12 prose dark:prose-invert">
         <h2 className="text-center">Why PDF Tool Box?</h2>
         <p className="text-center text-slate-600 dark:text-slate-400">
           PDF Tool Box is designed for students, developers, and office professionals who need quick, reliable access to file manipulation tools. 
           Whether you need to merge reports, calculate your age, or convert images for a presentation, we have a tool for it.
         </p>
      </section>
    </div>
  );
};

export default Home;