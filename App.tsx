
import React, { useState, useEffect, useCallback } from 'react';
import { fetchQuantumTrends } from './services/geminiService';
import { QuantumTrends } from './types';
import NewsCard from './components/NewsCard';
import Skeleton from './components/Skeleton';

const App: React.FC = () => {
  const [trends, setTrends] = useState<QuantumTrends | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchQuantumTrends();
      setTrends(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Failed to fetch latest quantum tech trends. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:px-8">
      {/* Header */}
      <header className="mb-16 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full"></div>
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-xs font-bold tracking-widest uppercase animate-pulse">
          <i className="fa-solid fa-atom mr-2"></i> Live Quantum Intelligence
        </div>
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-white to-purple-500">
          QuantumPulse
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8 font-light leading-relaxed">
          Tracking the frontiers of quantum computing, communication, and sensing. 
          Real-time global trends powered by Gemini Search Grounding.
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button 
            onClick={loadData}
            disabled={loading}
            className="px-8 py-3 bg-white text-slate-950 rounded-full font-bold transition-all hover:bg-cyan-400 hover:scale-105 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : <i className="fa-solid fa-rotate"></i>}
            Refresh Feed
          </button>
          <div className="text-slate-500 text-sm">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </header>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-center mb-12 flex items-center justify-center gap-3">
          <i className="fa-solid fa-triangle-exclamation"></i>
          {error}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
        
        {/* Chinese Section */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
              <i className="fa-solid fa-language text-2xl"></i>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">中文热度</h2>
              <p className="text-slate-500 text-sm">Top 5 Trending in Chinese</p>
            </div>
          </div>
          
          <div className="space-y-6">
            {loading ? (
              Array(5).fill(0).map((_, i) => <Skeleton key={`sk-zh-${i}`} />)
            ) : (
              trends?.chinese.map((item, idx) => (
                <NewsCard key={`zh-${idx}`} item={item} index={idx} lang="zh" />
              ))
            )}
          </div>
        </section>

        {/* English Section */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
              <i className="fa-solid fa-globe text-2xl"></i>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Global Trends</h2>
              <p className="text-slate-500 text-sm">Top 5 Trending in English</p>
            </div>
          </div>

          <div className="space-y-6">
            {loading ? (
              Array(5).fill(0).map((_, i) => <Skeleton key={`sk-en-${i}`} />)
            ) : (
              trends?.english.map((item, idx) => (
                <NewsCard key={`en-${idx}`} item={item} index={idx} lang="en" />
              ))
            )}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-24 pt-12 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p className="mb-4">&copy; 2025 QuantumPulse Intelligence. Powered by Gemini & Google Search.</p>
        <div className="flex justify-center gap-6">
          <span className="hover:text-cyan-400 cursor-pointer transition-colors">Documentation</span>
          <span className="hover:text-cyan-400 cursor-pointer transition-colors">API Access</span>
          <span className="hover:text-cyan-400 cursor-pointer transition-colors">Privacy Policy</span>
        </div>
      </footer>

      {/* Decorative background atoms */}
      <div className="fixed top-[10%] left-[5%] text-cyan-500/5 text-9xl -z-10 animate-[pulse-slow_8s_infinite]">
        <i className="fa-solid fa-atom"></i>
      </div>
      <div className="fixed bottom-[10%] right-[5%] text-purple-500/5 text-[12rem] -z-10 animate-[pulse-slow_12s_infinite]">
        <i className="fa-solid fa-microchip"></i>
      </div>
    </div>
  );
};

export default App;
