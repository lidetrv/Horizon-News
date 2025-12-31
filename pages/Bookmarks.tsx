
import React from 'react';
import { useNews } from '../components/NewsContext';
import NewsCard from '../components/NewsCard';
import { BookMarked, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Bookmarks: React.FC = () => {
  const { bookmarks } = useNews();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-10">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Feed
        </Link>
        <div className="flex items-center space-x-3">
          <BookMarked className="w-8 h-8 text-primary-600" />
          <h1 className="text-4xl font-serif font-bold">Your Reading List</h1>
        </div>
        <p className="mt-2 text-slate-500">Saved articles for later reading</p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookMarked className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">No bookmarks yet</h3>
          <p className="text-slate-500 mb-6">Articles you save will appear here for easy access.</p>
          <Link to="/" className="px-6 py-2 bg-primary-600 text-white rounded-full font-bold">
            Browse News
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bookmarks.map(article => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
