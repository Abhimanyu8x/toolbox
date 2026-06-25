import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center px-4 py-2.5 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base";
  
  const variants = {
    primary: "bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 focus:ring-brand-500 active:scale-[0.98]",
    secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm hover:shadow-md focus:ring-slate-500 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white dark:border-slate-700",
    outline: "border-2 border-slate-200 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 bg-transparent focus:ring-brand-500",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/20 focus:ring-red-500 active:scale-[0.98]"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;