
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { NewsArticle } from '../types';
import { getAISummary } from '../services/newsService';
import { useNews } from '../components/NewsContext';
import { ArrowLeft, Bookmark, Share2, Clock, Globe, Zap, User } from 'lucide-react';
import { format } from 'date-fns';
import { ArticleSkeleton } from '../components/Skeleton';
import toast from 'react-hot-toast';

const ArticleDetail: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isBookmarked, toggleBookmark } = useNews();
  const [article, setArticle] = useState<NewsArticle | null>(location.state?.article || null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (article) {
      handleGetAISummary();
    }
  }, [article]);

  const handleGetAISummary = async () => {
    if (!article) return;
    setLoadingSummary(true);
    const summary = await getAISummary(article);
    setAiSummary(summary);
    setLoadingSummary(false);
  };

  const handleShare = async () => {
    if (!article) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: article.url,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(article.url);
        toast.success('Link copied to clipboard!', {
          icon: '📋',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      } catch (err) {
        toast.error('Failed to copy link');
      }
    }
  };

  if (!article) return <ArticleSkeleton />;

  const bookmarked = isBookmarked(article.id);

  return (
    <div className="min-h-screen pb-20">
      {/* Top Bar Actions */}
      <div className="sticky top-16 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </button>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => toggleBookmark(article)}
              className={`p-2 rounded-full transition-colors ${bookmarked ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/30' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              title={bookmarked ? "Remove Bookmark" : "Add Bookmark"}
            >
              <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={handleShare}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" 
              title="Share Article"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 pt-10">
        <header className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <span className="px-2 py-1 bg-primary-600 text-white text-[10px] font-bold uppercase tracking-widest rounded">
              {article.category}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-6 dark:text-slate-50">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-y-4 gap-x-8 text-sm text-slate-600 dark:text-slate-400 border-y border-slate-100 dark:border-slate-800 py-6">
            <div className="flex items-center">
              <User className="w-5 h-5 mr-2 text-primary-500" />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 leading-none mb-1">Author</p>
                <p className="font-semibold">{article.author || 'Editorial Staff'}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Globe className="w-5 h-5 mr-2 text-primary-500" />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 leading-none mb-1">Source</p>
                <p className="font-semibold">{article.source.name}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-primary-500" />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 leading-none mb-1">Published</p>
                <p className="font-semibold">{format(new Date(article.publishedAt), 'MMMM do, yyyy')}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative h-[300px] md:h-[450px] rounded-3xl overflow-hidden mb-12 shadow-2xl">
          <img 
            src={article.image} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* AI Summary Box */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-12 relative">
          <div className="absolute -top-3 left-6 px-3 py-1 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center">
            <Zap className="w-3 h-3 mr-1 fill-current" /> AI INSIGHTS
          </div>
          <h3 className="font-bold text-lg mb-4 dark:text-slate-100">Key Takeaways</h3>
          {loadingSummary ? (
            <div className="space-y-3">
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full animate-pulse" />
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6 animate-pulse" />
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3 animate-pulse" />
            </div>
          ) : (
            <div className="text-slate-700 dark:text-slate-300 prose dark:prose-invert">
              {aiSummary?.split('\n').map((line, i) => (
                <p key={i} className="mb-2 leading-relaxed">{line}</p>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="prose dark:prose-invert prose-lg max-w-none text-slate-800 dark:text-slate-200 leading-relaxed mb-16">
          <p className="font-medium text-xl mb-6 text-slate-600 dark:text-slate-400 italic">
            {article.description}
          </p>
          <p>{article.content}</p>
          <p>The implications of this shift are wide-reaching, affecting both localized markets and global supply chains. As regulatory bodies begin to take notice, industry leaders are scrambling to adapt. Analysts suggest that we might see a formal policy change by the end of the next fiscal cycle.</p>
          <p>Further investigations are currently underway to determine the primary catalysts behind these unexpected fluctuations. Early reports point to a combination of technological disruption and shifting consumer sentiments.</p>
        </div>

        {/* Actions Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          <div className="text-center p-8 bg-slate-100 dark:bg-slate-900 rounded-3xl flex flex-col items-center justify-center">
            <h4 className="font-bold text-lg mb-4">Share with your network</h4>
            <button 
              onClick={handleShare}
              className="inline-flex items-center px-8 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-bold rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Share Story <Share2 className="w-4 h-4 ml-2" />
            </button>
          </div>
          <div className="text-center p-8 bg-primary-600 text-white rounded-3xl flex flex-col items-center justify-center">
            <h4 className="font-bold text-lg mb-4">Read the full investigation</h4>
            <a 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 bg-white text-primary-600 font-bold rounded-full hover:bg-primary-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Go to Source <Globe className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ArticleDetail;
