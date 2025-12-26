
import React, { useState, useEffect, useCallback } from 'react';
import { fetchQuantumTrends } from './services/geminiService';
import { QuantumTrends } from './types';
import NewsCard from './components/NewsCard';
import Skeleton from './components/Skeleton';

// Define AIStudio interface to match environmental type and resolve redeclaration errors
declare global {
  interface AIStudio {
    hasSelectedApiKey(): Promise<boolean>;
    openSelectKey(): Promise<void>;
  }

  interface Window {
    // Using optional modifier to match pre-configured environment and avoid modifier clash
    aistudio?: AIStudio;
  }
}

const App: React.FC = () => {
  const [trends, setTrends] = useState<QuantumTrends | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [needsKey, setNeedsKey] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const checkKeyAndLoad = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    // Check for API key availability
    const hasEnvKey = typeof process !== 'undefined' && process.env?.API_KEY;
    
    if (!hasEnvKey && window.aistudio) {
      const selected = await window.aistudio.hasSelectedApiKey();
      if (!selected) {
        setNeedsKey(true);
        setLoading(false);
        return;
      }
    } else if (!hasEnvKey) {
        setError("API Key 缺失。如果在 GitHub 部署，请确保在构建环境中配置了 API_KEY 变量。");
        setLoading(false);
        return;
    }

    try {
      const data = await fetchQuantumTrends();
      setTrends(data);
      setLastUpdated(new Date());
      setNeedsKey(false);
    } catch (err: any) {
      console.error(err);
      // Reset key selection state if entity not found error occurs
      if (err.message === "API_KEY_MISSING" || err.message === "ENTITY_NOT_FOUND") {
        setNeedsKey(true);
      } else {
        setError("实时抓取数据失败。这通常是因为搜索配额限制或网络波动，请稍后再试。");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkKeyAndLoad();
  }, [checkKeyAndLoad]);

  const handleOpenKeyDialog = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // MUST assume the key selection was successful after triggering openSelectKey() and proceed
      setNeedsKey(false);
      checkKeyAndLoad();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:px-8 min-h-screen flex flex-col">
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
          实时追踪量子计算、量子通信及感测领域的全球前沿动态。
        </p>
        
        {!needsKey && (
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button 
              onClick={checkKeyAndLoad}
              disabled={loading}
              className="px-8 py-3 bg-white text-slate-950 rounded-full font-bold transition-all hover:bg-cyan-400 hover:scale-105 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : <i className="fa-solid fa-rotate"></i>}
              刷新动态
            </button>
            <div className="text-slate-500 text-sm">
              最后更新: {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        )}
      </header>

      {/* Key Requirement UI */}
      {needsKey && (
        <div className="flex-1 flex flex-col items-center justify-center -mt-20">
          <div className="glass-card p-10 rounded-3xl text-center max-w-md border-cyan-500/30 glow-cyan">
            <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-400 text-3xl mx-auto mb-6 border border-cyan-500/20">
              <i className="fa-solid fa-key"></i>
            </div>
            <h2 className="text-2xl font-bold mb-4">需要 API 密钥</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              为了使用 Google Search Grounding 获取最新资讯，您需要关联一个有效的 API 密钥。请点击下方按钮进行配置。
            </p>
            <button 
              onClick={handleOpenKeyDialog}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20"
            >
              配置 API Key
              <i className="fa-solid fa-external-link text-xs"></i>
            </button>
            <p className="mt-6 text-xs text-slate-500 leading-snug">
              注意：请确保选择一个已启用结算功能的 GCP 项目。
              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline ml-1 hover:text-cyan-400">计费说明</a>
            </p>
          </div>
        </div>
      )}

      {error && !needsKey && (
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl text-red-400 text-center mb-12 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-2 font-bold text-lg">
            <i className="fa-solid fa-triangle-exclamation"></i>
            运行异常
          </div>
          <p className="text-sm opacity-90">{error}</p>
          <button onClick={checkKeyAndLoad} className="mt-4 text-xs underline opacity-70 hover:opacity-100">重试一次</button>
        </div>
      )}

      {/* Main Grid */}
      {!needsKey && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                <i className="fa-solid fa-language text-2xl"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">中文热度</h2>
                <p className="text-slate-500 text-sm">Top 5 Trending (ZH)</p>
              </div>
            </div>
            <div className="space-y-6">
              {loading ? Array(5).fill(0).map((_, i) => <Skeleton key={`sk-zh-${i}`} />) : 
                trends?.chinese?.map((item, idx) => <NewsCard key={`zh-${idx}`} item={item} index={idx} lang="zh" />)}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                <i className="fa-solid fa-globe text-2xl"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Global Trends</h2>
                <p className="text-slate-500 text-sm">Top 5 Trending (EN)</p>
              </div>
            </div>
            <div className="space-y-6">
              {loading ? Array(5).fill(0).map((_, i) => <Skeleton key={`sk-en-${i}`} />) : 
                trends?.english?.map((item, idx) => <NewsCard key={`en-${idx}`} item={item} index={idx} lang="en" />)}
            </div>
          </section>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto pt-12 pb-8 border-t border-slate-800 text-center text-slate-500 text-sm">
        {/* Mandated Search Sources listing requirement */}
        {trends?.groundingUrls && trends.groundingUrls.length > 0 && (
          <div className="mb-8 text-left max-w-4xl mx-auto p-6 glass-card rounded-xl border-slate-800 bg-slate-900/30">
            <h4 className="text-slate-300 font-bold mb-3 flex items-center gap-2 text-xs uppercase tracking-widest">
              <i className="fa-solid fa-link text-cyan-500"></i>
              搜索引用源 (Search Sources)
            </h4>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {trends.groundingUrls.map((url, i) => (
                <a 
                  key={i} 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[10px] text-slate-600 hover:text-cyan-400 transition-colors truncate max-w-[200px]"
                >
                  {url}
                </a>
              ))}
            </div>
          </div>
        )}
        <p className="mb-4">&copy; 2025 QuantumPulse Intelligence. Powered by Gemini & Google Search.</p>
        <div className="flex justify-center gap-6">
          <span className="hover:text-cyan-400 cursor-pointer transition-colors">Documentation</span>
          <span className="hover:text-cyan-400 cursor-pointer transition-colors">API Access</span>
        </div>
      </footer>

      <div className="fixed top-[10%] left-[5%] text-cyan-500/5 text-9xl -z-10 animate-[pulse-slow_8s_infinite]">
        <i className="fa-solid fa-atom"></i>
      </div>
    </div>
  );
};

export default App;
