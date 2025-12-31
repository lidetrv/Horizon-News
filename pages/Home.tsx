
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNews } from '../components/NewsContext';
import { fetchNews, fetchTrendingNews } from '../services/newsService';
import { NewsArticle } from '../types';
import NewsCard from '../components/NewsCard';
import { NewsCardSkeleton } from '../components/Skeleton';
import { TrendingUp, Sparkles, Filter, RefreshCw, Zap, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { 
    selectedCategory, searchQuery, 
    searchSort, searchRange 
  } = useNews();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [trendingArticles, setTrendingArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  // Pull to refresh states
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const isPulling = useRef(false);

  const lastArticleRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const loadArticles = async (p: number, reset: boolean) => {
    if (reset) {
      if (!isRefreshing) setLoading(true);
    } else {
      setLoading(true);
    }
    
    try {
      const data = await fetchNews(p, selectedCategory, searchQuery, searchSort, searchRange);
      if (data.length === 0) setHasMore(false);
      setArticles(prev => reset ? data : [...prev, ...data]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadTrending = async () => {
    setLoadingTrending(true);
    try {
      const data = await fetchTrendingNews();
      setTrendingArticles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTrending(false);
    }
  };

  // Re-fetch when category, query, sort, or range changes
  useEffect(() => {
    setArticles([]);
    setPage(1);
    setHasMore(true);
    loadArticles(1, true);
    loadTrending();
  }, [selectedCategory, searchQuery, searchSort, searchRange]);

  useEffect(() => {
    if (page > 1) {
      loadArticles(page, false);
    }
  }, [page]);

  // Touch Handlers for Pull-to-Refresh
  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY <= 0) {
      startY.current = e.touches[0].clientY;
      isPulling.current = true;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling.current) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    
    if (diff > 0) {
      const distance = Math.min(diff * 0.4, 120);
      setPullDistance(distance);
      if (diff > 10 && e.cancelable) {
        e.preventDefault();
      }
    } else {
      isPulling.current = false;
      setPullDistance(0);
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling.current) return;
    isPulling.current = false;
    
    if (pullDistance > 70) {
      setIsRefreshing(true);
      setPullDistance(60); 
      await Promise.all([loadArticles(1, true), loadTrending()]);
      setIsRefreshing(false);
      setPullDistance(0);
    } else {
      setPullDistance(0);
    }
  };

  return (
    <div 
      className="max-w-7xl mx-auto px-4 py-8 relative overflow-x-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to Refresh Indicator */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-50 flex flex-col items-center justify-center transition-all duration-200 ease-out"
        style={{ 
          top: `${pullDistance - 40}px`, 
          opacity: Math.min(pullDistance / 60, 1),
          transform: `translateX(-50%) rotate(${pullDistance * 2}deg)`
        }}
      >
        <div className="bg-white dark:bg-slate-800 shadow-lg rounded-full p-2 border border-slate-200 dark:border-slate-700">
          <RefreshCw className={`w-5 h-5 text-primary-600 ${isRefreshing ? 'animate-spin' : ''}`} />
        </div>
      </div>

      <div className={`flex flex-col lg:flex-row gap-8 transition-transform duration-200 ease-out`} style={{ transform: `translateY(${pullDistance * 0.5}px)` }}>
        
        {/* Main Feed */}
        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-serif font-bold capitalize">
                {searchQuery ? `Results for "${searchQuery}"` : `${selectedCategory} News`}
              </h2>
              {(searchSort !== 'relevancy' || searchRange !== 'all') && (
                <p className="text-xs text-primary-600 dark:text-primary-400 font-bold mt-1 uppercase tracking-tighter">
                  Filtered by {searchSort} • {searchRange}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2 text-slate-500 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800">
              <Filter className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Global Insights</span>
            </div>
          </div>

          {articles.length === 0 && !loading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">No results found</h3>
              <p className="text-slate-500">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {articles.map((article, index) => {
                if (articles.length === index + 1) {
                  return (
                    <div ref={lastArticleRef} key={article.id}>
                      <NewsCard article={article} />
                    </div>
                  );
                }
                return <NewsCard key={article.id} article={article} />;
              })}
              
              {loading && !isRefreshing && Array.from({ length: 6 }).map((_, i) => (
                <NewsCardSkeleton key={i} />
              ))}
            </div>
          )}

          {!hasMore && !loading && articles.length > 0 && (
            <div className="py-12 text-center text-slate-500">
              <p className="text-sm font-medium">You've reached the end of the feed.</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-80 space-y-8">
          {/* Trending Section */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-lg">Trending Now</h3>
              </div>
              <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
            </div>
            
            <div className="space-y-6">
              {loadingTrending ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-start space-x-3 animate-pulse">
                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded flex-shrink-0" />
                    <div className="flex-grow space-y-2">
                      <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full" />
                      <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
                    </div>
                  </div>
                ))
              ) : (
                trendingArticles.map((article, i) => (
                  <Link 
                    to={`/article/${article.id}`} 
                    state={{ article }}
                    key={article.id} 
                    className="group flex items-start space-x-3 cursor-pointer"
                  >
                    <span className="text-2xl font-black text-slate-200 dark:text-slate-800 group-hover:text-primary-500 transition-colors leading-none">
                      0{i + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm leading-snug line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {article.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">
                        {article.source.name}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* AI Spotlight Section */}
          <div className="bg-gradient-to-br from-primary-600 to-purple-600 rounded-2xl p-6 text-white overflow-hidden relative shadow-lg">
            <Sparkles className="absolute -top-4 -right-4 w-24 h-24 text-white/10" />
            <h3 className="font-bold text-lg mb-2 relative z-10">AI Spotlight</h3>
            <p className="text-sm text-primary-50 mb-4 relative z-10 leading-relaxed">
              Experience the future of journalism with real-time AI context and summaries.
            </p>
            <button className="w-full bg-white text-primary-600 py-2 rounded-lg font-bold text-sm hover:bg-primary-50 transition-all hover:scale-[1.02] active:scale-[0.98]">
              Try AI Pro
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Home;
