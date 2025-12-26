
import React from 'react';

const Skeleton: React.FC = () => {
  return (
    <div className="glass-card p-6 rounded-2xl animate-pulse border border-slate-800">
      <div className="h-4 bg-slate-800 rounded w-1/4 mb-4"></div>
      <div className="h-6 bg-slate-800 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-slate-800 rounded w-full mb-2"></div>
      <div className="h-4 bg-slate-800 rounded w-5/6 mb-6"></div>
      <div className="h-4 bg-slate-800 rounded w-1/3"></div>
    </div>
  );
};

export default Skeleton;
