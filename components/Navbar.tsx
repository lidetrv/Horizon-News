
import React, { useState, useEffect, useRef } from 'react';
import { Search, Moon, Sun, Menu, X, Bell, User, Bookmark, SlidersHorizontal, Calendar, Check } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { useNews, SearchSort, SearchRange } from './NewsContext';
import { NewsCategory } from '../types';
import { getSearchSuggestions } from '../services/newsService';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { 
    selectedCategory, setSelectedCategory, 
    setSearchQuery, bookmarks,
    searchSort, setSearchSort,
    searchRange, setSearchRange
  } = useNews();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (localSearch.length >= 3) {
        const res = await getSearchSuggestions(localSearch);
        setSuggestions(res);
      } else {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [localSearch]);

  const categories = Object.values(NewsCategory);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    setSearchQuery(localSearch);
    setShowSuggestions(false);
    navigate('/');
  };

  const sortOptions: { label: string; value: SearchSort }[] = [
    { label: 'Most Relevant', value: 'relevancy' },
    { label: 'Most Popular', value: 'popularity' },
    { label: 'Newest First', value: 'publishedAt' },
  ];

  const rangeOptions: { label: string; value: SearchRange }[] = [
    { label: 'All Time', value: 'all' },
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={() => setSelectedCategory(NewsCategory.GENERAL)}>
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <span className="hidden lg:block text-xl font-serif font-bold tracking-tight">Horizon News</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-4 flex items-center relative" ref={searchRef}>
            <div className="flex-grow relative">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search news..."
                  className="w-full pl-10 pr-10 py-2 bg-slate-100 dark:bg-slate-900 border-none rounded-l-full rounded-r-none md:rounded-full focus:ring-2 focus:ring-primary-500 text-sm transition-all"
                  value={localSearch}
                  onChange={(e) => { setLocalSearch(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                />
              </form>
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-slate-900 shadow-xl rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-[60]">
                  {suggestions.map((s, i) => (
                    <button 
                      key={i}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      onClick={() => { setLocalSearch(s); handleSearchSubmit(); }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Filter Toggle */}
            <div className="relative" ref={filterRef}>
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-r-full md:rounded-full md:ml-2 text-xs font-bold transition-colors border-l md:border-l-0 ${
                  isFilterOpen 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Filters</span>
              </button>

              {/* Filter Dropdown */}
              {isFilterOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-900 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-800 p-4 z-[70] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-2 flex items-center">
                        <SlidersHorizontal className="w-3 h-3 mr-1" /> Sort By
                      </p>
                      <div className="space-y-1">
                        {sortOptions.map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => setSearchSort(opt.value)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                              searchSort === opt.value 
                              ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600' 
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                          >
                            {opt.label}
                            {searchSort === opt.value && <Check className="w-3 h-3" />}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-2 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" /> Date Range
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {rangeOptions.map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => setSearchRange(opt.value)}
                            className={`px-2 py-1.5 rounded-lg text-[10px] font-bold text-center border transition-all ${
                              searchRange === opt.value 
                              ? 'bg-primary-600 border-primary-600 text-white' 
                              : 'border-slate-200 dark:border-slate-700 hover:border-primary-400 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Link to="/bookmarks" className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors relative">
              <Bookmark className="w-5 h-5" />
              {bookmarks.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white dark:border-slate-950">
                  {bookmarks.length}
                </span>
              )}
            </Link>
            <button onClick={toggleTheme} className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors">
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-slate-600 dark:text-slate-400">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="hidden md:flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800 ml-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary-500 transition-all">
                <User className="w-4 h-4 text-slate-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Categories Bar (Desktop) */}
        <div className="hidden md:flex items-center space-x-6 h-10 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap border-b-2 px-1 transition-all ${
                selectedCategory === cat 
                  ? 'border-primary-600 text-primary-600 py-2' 
                  : 'border-transparent text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 py-2'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
          <div className="px-4 py-4 space-y-2 max-h-[70vh] overflow-y-auto">
            <p className="text-[10px] uppercase font-bold text-slate-400 px-4 mb-2">Categories</p>
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => { setSelectedCategory(cat); setIsMenuOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat ? 'bg-primary-50 text-primary-600' : 'text-slate-600 dark:text-slate-400 active:bg-slate-50'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
