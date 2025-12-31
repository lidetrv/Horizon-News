
import React from 'react';

export const NewsCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 animate-pulse">
    <div className="h-48 bg-slate-200 dark:bg-slate-800" />
    <div className="p-4 space-y-3">
      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
      <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-full" />
      <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
      <div className="space-y-1 pt-2">
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-4/5" />
      </div>
    </div>
  </div>
);

export const ArticleSkeleton: React.FC = () => (
  <div className="max-w-4xl mx-auto p-4 animate-pulse">
    <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-6" />
    <div className="flex space-x-4 mb-8">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24" />
    </div>
    <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-xl mb-8" />
    <div className="space-y-4">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
    </div>
  </div>
);
