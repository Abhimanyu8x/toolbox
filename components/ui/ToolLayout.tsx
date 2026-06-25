import React from 'react';
// @ts-ignore
import { Helmet } from 'react-helmet';
import { LucideIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { allTools } from '../../data/tools';
import toolKeywords from '../../data/toolKeywords';

interface ToolLayoutProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  relatedTools?: { name: string; path: string }[];
  faqs?: { question: string; answer: string }[];
  instructions?: string[];
  keywords?: string;
}

const ToolLayout: React.FC<ToolLayoutProps> = ({ 
  title, 
  description, 
  children, 
  relatedTools = [], 
  faqs = [],
  instructions = [],
  keywords
}) => {
  const location = useLocation();
  const currentTool = allTools.find((tool) => tool.path === location.pathname);
  const defaultKeywords = `${title}, ${title.split(/\s+/).join(', ')}, online tool, free utility, browser tool, secure tool, privacy-first, quick tool`;
  const currentToolKeywords = toolKeywords[location.pathname];
  const seoKeywords = keywords || currentToolKeywords || currentTool?.keywords || defaultKeywords;
  const canonicalUrl = typeof window !== 'undefined' ? window.location.href : 'https://letterflow.online/';
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: canonicalUrl,
    name: `${title} | ToolBox`,
    description,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pb-12">
      <Helmet>
        <title>{title} | ToolBox</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={seoKeywords} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`${title} | ToolBox`} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://letterflow.online/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${title} | ToolBox`} />
        <meta name="twitter:description" content={description} />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {title}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Main Tool Area */}
      <div className="w-full">
        {children}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        
        {/* Instructions */}
        {instructions.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">How to use</h2>
            <div className="space-y-4">
              {instructions.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-brand-100 text-brand-600 font-semibold text-sm dark:bg-brand-900/30 dark:text-brand-400">
                    {idx + 1}
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQs */}
        {faqs.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{faq.question}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <div className="border-t border-slate-200 dark:border-slate-800 pt-12 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">Related Tools</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {relatedTools.map((tool) => (
              <Link 
                key={tool.path} 
                to={tool.path}
                className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-600 dark:text-slate-300 hover:border-brand-500 hover:text-brand-600 dark:hover:border-brand-500 transition-all shadow-sm"
              >
                {tool.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolLayout;