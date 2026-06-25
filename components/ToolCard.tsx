import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface ToolCardProps {
  name: string;
  description: string;
  icon: LucideIcon;
  path: string;
  color?: string;
}

const ToolCard: React.FC<ToolCardProps> = ({ name, description, icon: Icon, path, color }) => {
  // Default color if not provided
  const iconColorClass = color || 'text-brand-500 bg-brand-50 dark:bg-brand-900/20';

  return (
    <Link 
      to={path}
      className="group block h-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-1 hover:border-brand-200 dark:hover:border-brand-900"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3.5 rounded-xl transition-colors ${iconColorClass} group-hover:scale-110 duration-300`}>
          <Icon size={28} />
        </div>
        <ArrowRight className="text-slate-300 group-hover:text-brand-500 transition-colors" size={20} />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand-600 transition-colors">
        {name}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
    </Link>
  );
};

export default ToolCard;