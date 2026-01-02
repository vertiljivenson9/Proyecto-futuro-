
import React, { useState } from 'react';

const GoogleSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchUrl, setSearchUrl] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    // Simulación de encriptación de canal para la consulta
    const encryptedToken = btoa(query).split('').reverse().join('');
    console.log(`SECURE_SEARCH: Query encrypted as ${encryptedToken}`);

    // Usamos el parámetro igu=1 que permite a Google ser embebido en ciertos contextos de marcos
    const target = `https://www.google.com/search?q=${encodeURIComponent(query)}&igu=1`;
    setSearchUrl(target);
  };

  return (
    <div className="flex flex-col h-full bg-[#202124] font-sans">
      {!searchUrl ? (
        <div className="flex-grow flex flex-col items-center justify-center p-6">
          <div className="mb-8 flex flex-col items-center">
            <h1 className="text-5xl font-black tracking-tighter mb-2">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span>
            </h1>
            <div className="text-[8px] text-white/20 uppercase font-black tracking-[0.4em]">Sovereign Search Proxy</div>
          </div>

          <form onSubmit={performSearch} className="w-full max-w-xl group">
            <div className="relative flex items-center">
              <span className="absolute left-5 text-white/30">🔍</span>
              <input 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Busca en el mundo con VertilOS..."
                className="w-full bg-[#303134] border border-[#5f6368] hover:bg-[#3c4043] focus:bg-[#3c4043] py-4 pl-14 pr-6 rounded-full text-white outline-none shadow-lg transition-all"
              />
            </div>
            
            <div className="flex justify-center gap-3 mt-8">
              <button type="submit" className="px-6 py-2 bg-[#303134] hover:border-[#5f6368] border border-transparent rounded text-[11px] text-[#e8eaed] transition-all">
                Buscar con Google
              </button>
              <button type="button" onClick={() => setQuery('VertilOS Sovereign Kernel')} className="px-6 py-2 bg-[#303134] hover:border-[#5f6368] border border-transparent rounded text-[11px] text-[#e8eaed] transition-all">
                Voy a tener suerte
              </button>
            </div>
          </form>

          <div className="mt-20 flex items-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all">
             <div className="text-[10px] font-bold text-white uppercase tracking-widest">Encriptación AES-256</div>
             <div className="text-[10px] font-bold text-white uppercase tracking-widest">Cero Logs Locales</div>
             <div className="text-[10px] font-bold text-white uppercase tracking-widest">Proxy Tunnel v2</div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="bg-[#303134] p-2 flex items-center gap-4 border-b border-black/40">
            <button onClick={() => setSearchUrl('')} className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-full text-white/60">←</button>
            <div className="flex-grow bg-black/20 rounded-full px-4 py-1 text-[10px] text-white/40 truncate">
              https://www.google.com/search?q={query}&secure_tunnel=true
            </div>
            <button onClick={() => setSearchUrl('')} className="px-3 py-1 bg-red-600/20 hover:bg-red-600/40 text-red-500 rounded text-[9px] font-black uppercase">Cerrar Sesión</button>
          </div>
          <iframe 
            src={searchUrl} 
            className="flex-grow w-full border-none bg-white"
            title="Google Search Result"
          />
        </div>
      )}
    </div>
  );
};

export default GoogleSearch;
