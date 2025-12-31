
import { NewsArticle, NewsCategory } from '../types';
import { GoogleGenAI } from '@google/genai';
import { SearchSort, SearchRange } from '../components/NewsContext';

const API_KEY = process.env.API_KEY || '';

const MOCK_IMAGES = [
  'https://picsum.photos/seed/news1/800/450',
  'https://picsum.photos/seed/news2/800/450',
  'https://picsum.photos/seed/news3/800/450',
  'https://picsum.photos/seed/news4/800/450',
  'https://picsum.photos/seed/news5/800/450'
];

const generateMockArticles = (page: number, category: string, sort: string = ''): NewsArticle[] => {
  return Array.from({ length: 12 }).map((_, i) => {
    const id = `article-${page}-${i}-${category}-${sort}`;
    return {
      id,
      title: `${category.toUpperCase()} ${sort === 'publishedAt' ? 'Breaking' : 'Top'} Story: New Insights Revealed`,
      description: `New data suggests a massive shift in the upcoming quarter for the ${category} sector. Experts are analyzing these trends to determine long-term impact.`,
      content: `This is a comprehensive report on the latest developments. Researchers highlight significant anomalies in current market trends. The study voices concerns regarding the long-term sustainability of current models...`,
      url: `https://example.com/${id}`,
      image: MOCK_IMAGES[i % MOCK_IMAGES.length],
      publishedAt: new Date(Date.now() - (i + (page-1)*12) * 3600000).toISOString(),
      source: { name: 'Horizon Global' },
      author: 'Alex Sterling',
      category: category
    };
  });
};

export const fetchNews = async (
  page: number, 
  category: NewsCategory, 
  query: string = '',
  sort: SearchSort = 'relevancy',
  range: SearchRange = 'all'
): Promise<NewsArticle[]> => {
  // Logic to simulate filtering based on query/sort/range
  console.log(`Fetching page ${page} with query: ${query}, sort: ${sort}, range: ${range}`);
  await new Promise(resolve => setTimeout(resolve, 800));
  return generateMockArticles(page, category, sort);
};

export const fetchTrendingNews = async (): Promise<NewsArticle[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return generateMockArticles(1, 'trending', 'popularity').slice(0, 5).map(article => ({
    ...article,
    title: article.title.replace('TRENDING', 'Global Trend')
  }));
};

export const getAISummary = async (article: NewsArticle): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize the following news article in 3 concise bullet points for a busy reader:
      Title: ${article.title}
      Description: ${article.description}
      Content: ${article.content}`,
      config: {
        systemInstruction: 'You are a professional news editor. Provide concise, accurate summaries.'
      }
    });
    return response.text || 'No summary available.';
  } catch (err) {
    console.error('AI Summary Error:', err);
    return 'Unable to generate AI summary at this moment.';
  }
};

export const getSearchSuggestions = async (query: string): Promise<string[]> => {
  if (query.length < 3) return [];
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide 5 news-related search term suggestions based on the prefix: "${query}". Return only the terms separated by commas.`,
      config: {
        systemInstruction: 'You are a search assistant.'
      }
    });
    return (response.text || '').split(',').map(s => s.trim()).filter(Boolean);
  } catch {
    return [];
  }
};
