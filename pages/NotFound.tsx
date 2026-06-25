import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-brand-500 mb-4">404</h1>
      <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">Oops! This tool is still under construction or doesn't exist.</p>
      <Link to="/" className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">Go Home</Link>
    </div>
  );
};

export default NotFound;