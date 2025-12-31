
import React, { useState } from 'react';
import { NewsArticle } from '../types';
import { useNews } from './NewsContext';
import { Bookmark, Share2, Clock, User, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const { toggleBookmark, isBookmarked } = useNews();
  const bookmarked = isBookmarked(article.id);
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(article.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy link:', err);
        alert('Sharing not supported on this browser. Link: ' + article.url);
      }
    }
  };

  return (
    <div className="gradient-border group transition-all duration-300 hover:-translate-y-1 animate-fade-slide-up">
      <Link to={`/article/${article.id}`} state={{ article }} className="inner-card flex flex-col h-full overflow-hidden">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={article.image} 
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-2 right-2 flex space-x-2">
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleBookmark(article); }}
              className={`p-2 rounded-full backdrop-blur-md transition-colors ${bookmarked ? 'bg-primary-500 text-white' : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200'}`}
              title={bookmarked ? "Remove Bookmark" : "Add Bookmark"}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
          <div className="absolute bottom-2 left-2">
            <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-primary-600 text-white rounded">
              {article.category}
            </span>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-center text-[11px] text-slate-500 dark:text-slate-400 mb-2 space-x-3">
            <span className="flex items-center"><User className="w-3 h-3 mr-1" /> {article.source.name}</span>
            <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {formatDistanceToNow(new Date(article.publishedAt))} ago</span>
          </div>
          
          <h3 className="text-lg font-bold leading-tight mb-2 line-clamp-2 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {article.title}
          </h3>
          
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 flex-grow">
            {article.description}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-primary-600 dark:text-primary-400 text-sm font-semibold hover:underline">Read Story</span>
            <div className="relative flex items-center">
              {copied && (
                <span className="absolute right-full mr-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded whitespace-nowrap animate-in fade-in slide-in-from-right-1 duration-200">
                  Link Copied!
                </span>
              )}
              <button 
                onClick={handleShare}
                className={`p-1.5 transition-colors rounded-full ${copied ? 'text-green-500 bg-green-50 dark:bg-green-900/20' : 'text-slate-400 hover:text-primary-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                title="Share Article"
              >
                {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default NewsCard;
