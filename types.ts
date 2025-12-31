
export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    id?: string;
  };
  author: string;
  category: string;
}

export enum NewsCategory {
  GENERAL = 'general',
  BUSINESS = 'business',
  TECHNOLOGY = 'technology',
  ENTERTAINMENT = 'entertainment',
  HEALTH = 'health',
  SCIENCE = 'science',
  SPORTS = 'sports',
  TRENDING = 'trending'
}

export interface AppSettings {
  country: string;
  language: string;
  theme: 'light' | 'dark';
}

export interface NewsState {
  articles: NewsArticle[];
  bookmarks: NewsArticle[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
}
