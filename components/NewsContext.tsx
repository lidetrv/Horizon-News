
import React, { createContext, useContext, useState, useEffect } from 'react';
import { NewsArticle, NewsCategory } from '../types';
import toast from 'react-hot-toast';

export type SearchSort = 'relevancy' | 'popularity' | 'publishedAt';
export type SearchRange = 'all' | 'today' | 'week' | 'month';

interface NewsContextType {
  bookmarks: NewsArticle[];
  toggleBookmark: (article: NewsArticle) => void;
  isBookmarked: (id: string) => boolean;
  selectedCategory: NewsCategory;
  setSelectedCategory: (cat: NewsCategory) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchSort: SearchSort;
  setSearchSort: (sort: SearchSort) => void;
  searchRange: SearchRange;
  setSearchRange: (range: SearchRange) => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<NewsArticle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>(NewsCategory.GENERAL);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSort, setSearchSort] = useState<SearchSort>('relevancy');
  const [searchRange, setSearchRange] = useState<SearchRange>('all');

  useEffect(() => {
    const saved = localStorage.getItem('bookmarks');
    if (saved) setBookmarks(JSON.parse(saved));
  }, []);

  const toggleBookmark = (article: NewsArticle) => {
    setBookmarks(prev => {
      const exists = prev.find(b => b.id === article.id);
      let next;
      if (exists) {
        next = prev.filter(b => b.id !== article.id);
        toast('Article removed from bookmarks', {
          icon: '🗑️',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      } else {
        next = [...prev, article];
        toast.success('Article saved to bookmarks!', {
          icon: '🔖',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      }
      localStorage.setItem('bookmarks', JSON.stringify(next));
      return next;
    });
  };

  const isBookmarked = (id: string) => bookmarks.some(b => b.id === id);

  return (
    <NewsContext.Provider value={{ 
      bookmarks, toggleBookmark, isBookmarked, 
      selectedCategory, setSelectedCategory,
      searchQuery, setSearchQuery,
      searchSort, setSearchSort,
      searchRange, setSearchRange
    }}>
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) throw new Error('useNews must be used within a NewsProvider');
  return context;
};
