import React, { useState } from 'react';
const VertiJEdge = () => {
  const [query, setQuery] = useState('');
  const [url, setUrl] = useState('');
  const OCEAN_BG = "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=2000";
  return (
    <div className="flex flex-col h-full bg-[#0a0a0a]">
      <div className="h-12 bg-[#1b1b1b] flex items-center px-4 gap-4">
        <button onClick={() => setUrl('')}>🏠</button>
        <form onSubmit={e => { e.preventDefault(); setUrl(`https://www.google.com/search?q=${encodeURIComponent(query)}&igu=1`); }} className="flex-grow">
          <input value={query} onChange={e => setQuery(e.target.value)} className="w-full bg-[#2b2b2b] rounded-full px-4 text-xs text-white" />
        </form>
      </div>
      <div className="flex-grow relative bg-black">
        {!url ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
            <img src={OCEAN_BG} className="absolute inset-0 w-full h-full object-cover opacity-50" />
            <div className="z-10 text-8xl font-black text-white">VJ</div>
          </div>
        ) : <iframe src={url} className="w-full h-full" />}
      </div>
    </div>
  );
};
export default VertiJEdge;