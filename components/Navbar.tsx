import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, FileText, Moon, Sun, Search, ArrowRight } from 'lucide-react';
import { allTools } from '../data/tools';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'PDF Tools', path: '/tools/pdf' },
    { name: 'Daily Tools', path: '/tools/daily' },
    { name: 'Image Tools', path: '/tools/image' },
    { name: 'Student', path: '/tools/student' },
  ];

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = allTools.filter(tool => 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  }, [location.pathname]);

  const handleSearchSelect = (path: string) => {
    navigate(path);
    setSearchQuery('');
    setSearchResults([]);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 dark:bg-slate-900/80 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 mr-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-brand-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-br from-brand-600 to-indigo-700 text-white p-2.5 rounded-xl shadow-xl shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300 border border-white/10">
                  <FileText size={24} strokeWidth={2.5} className="drop-shadow-md" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight leading-none group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  PDF Tool Box
                </span>
                <span className="text-[10px] font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-widest leading-none mt-0.5">
                  Pro Tools
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Search & Nav */}
          <div className="hidden md:flex flex-1 items-center justify-between">
            {/* Search Bar */}
            <div className="relative max-w-xs w-full ml-4" ref={searchRef}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-full leading-5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all hover:bg-white dark:hover:bg-slate-700/50"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden max-h-80 overflow-y-auto">
                  {searchResults.map((tool) => (
                    <button
                      key={tool.path}
                      onClick={() => handleSearchSelect(tool.path)}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center justify-between group transition-colors"
                    >
                      <div>
                        <span className="block font-medium text-slate-800 dark:text-white">{tool.name}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{tool.category}</span>
                      </div>
                      <ArrowRight size={16} className="text-slate-300 group-hover:text-brand-500 dark:group-hover:text-brand-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Links */}
            <div className="flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-brand-600 dark:hover:text-brand-400 ${
                    isActive(link.path) ? 'text-brand-600 dark:text-brand-400' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>

              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400"
                aria-label="Toggle Theme"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              

            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-4">
             <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 dark:bg-slate-900/95 dark:border-slate-800 animate-slide-up">
          <div className="px-4 pt-4 pb-2">
             <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg leading-5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                 {/* Mobile Search Results */}
                 {searchResults.length > 0 && searchQuery && (
                  <div className="mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-inner border border-slate-200 dark:border-slate-700">
                    {searchResults.slice(0, 5).map((tool) => (
                      <button
                        key={tool.path}
                        onClick={() => handleSearchSelect(tool.path)}
                        className="w-full text-left px-4 py-3 border-b border-slate-100 dark:border-slate-700 last:border-0 text-slate-800 dark:text-white text-sm"
                      >
                        {tool.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
          </div>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2.5 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {link.name}
              </Link>
            ))}

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;