
import React from 'react';
import { NewsItem } from '../types';

interface NewsCardProps {
  item: NewsItem;
  index: number;
  lang: 'zh' | 'en';
}

const NewsCard: React.FC<NewsCardProps> = ({ item, index, lang }) => {
  return (
    <div 
      className={`group relative glass-card p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-slate-800/60 ${lang === 'zh' ? 'hover:glow-cyan border-cyan-500/20' : 'hover:glow-purple border-purple-500/20'}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex justify-between items-start mb-4">
        <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded bg-opacity-20 ${lang === 'zh' ? 'text-cyan-400 bg-cyan-400' : 'text-purple-400 bg-purple-400'}`}>
          {item.source || 'Breaking'}
        </span>
        <span className="text-slate-500 text-xs">#{index + 1}</span>
      </div>
      
      <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors leading-snug">
        {item.title}
      </h3>
      
      <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed">
        {item.summary}
      </p>
      
      <a 
        href={item.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 text-sm font-semibold transition-all ${lang === 'zh' ? 'text-cyan-400 hover:text-cyan-300' : 'text-purple-400 hover:text-purple-300'}`}
      >
        {lang === 'zh' ? '阅读全文' : 'Read More'}
        <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
      </a>
      
      {/* Decorative pulse element */}
      <div className={`absolute -bottom-1 -right-1 w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl ${lang === 'zh' ? 'bg-cyan-500' : 'bg-purple-500'}`}></div>
    </div>
  );
};

export default NewsCard;
