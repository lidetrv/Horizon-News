
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeContext';
import { NewsProvider } from './components/NewsContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import Bookmarks from './pages/Bookmarks';
import { Twitter, Facebook, Linkedin } from 'lucide-react';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Toaster 
        position="bottom-center"
        toastOptions={{
          className: 'dark:bg-slate-800 dark:text-white',
          duration: 3000,
        }}
      />
      <NewsProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/article/:id" element={<ArticleDetail />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
              </Routes>
            </main>
            
            {/* Footer */}
            <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 py-12">
              <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex flex-col items-center md:items-start">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-6 h-6 bg-primary-600 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-sm">H</span>
                    </div>
                    <span className="font-serif font-bold text-lg">Horizon News</span>
                  </div>
                  <p className="text-xs text-slate-500">© 2024 Horizon News AI. All rights reserved.</p>
                </div>
                
                <div className="flex items-center space-x-8 text-sm font-medium text-slate-500">
                  <a href="#" className="hover:text-primary-600 transition-colors">Privacy</a>
                  <a href="#" className="hover:text-primary-600 transition-colors">Terms</a>
                  <a href="#" className="hover:text-primary-600 transition-colors">Contact</a>
                  <a href="#" className="hover:text-primary-600 transition-colors">Newsletter</a>
                </div>

                <div className="flex items-center space-x-4">
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300" title="Follow us on X">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300" title="Follow us on Facebook">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:text-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300" title="Follow us on LinkedIn">
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </Router>
      </NewsProvider>
    </ThemeProvider>
  );
};

export default App;
