
import React, { useState } from 'react';

const TorBrowser: React.FC = () => {
  const [url, setUrl] = useState('');
  const [searchTarget, setSearchTarget] = useState('');
  const [isTunneling, setIsTunneling] = useState(false);

  // Ahmia es un motor de búsqueda real para la red Onion que funciona bien con filtros
  const DARK_SEARCH = "https://ahmia.fi/search/?q=";

  const navigateTo = (targetUrl: string) => {
    setIsTunneling(true);
    let finalUrl = targetUrl;
    
    // Simulación de Proxy Gateway para evitar X-Frame-Options en sitios compatibles
    if (targetUrl.includes('.onion')) {
      const onionPart = targetUrl.split('://')[1] || targetUrl;
      finalUrl = `https://${onionPart.replace('.onion', '.onion.ly')}`;
    } else if (!targetUrl.startsWith('http')) {
      finalUrl = DARK_SEARCH + encodeURIComponent(targetUrl);
    } else {
      // Usar proxy para sitios normales que bloquean iframes
      finalUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
    }

    setSearchTarget(finalUrl);
    setTimeout(() => setIsTunneling(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo(url);
  };

  return (
    <div className="flex flex-col h-full bg-[#080110] font-mono overflow-hidden">
      <div className="h-14 bg-black/60 border-b border-purple-500/30 flex items-center px-4 gap-4 z-20">
        <button onClick={() => setSearchTarget('')} className="text-purple-500 text-xl hover:scale-110 transition-transform">🧅</button>
        <form onSubmit={handleSubmit} className="flex-grow flex items-center bg-black/40 rounded-xl border border-purple-900/40 px-3 py-1.5 focus-within:border-purple-500 transition-all">
          <input 
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="Search Dark Web (Hidden Wiki, TorLinks...)"
            className="bg-transparent outline-none border-none text-[11px] text-purple-300 w-full placeholder:text-purple-900"
          />
        </form>
        <div className="flex items-center gap-2">
          <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest">Circuit_Established</span>
        </div>
      </div>

      {!searchTarget ? (
        <div className="flex-grow flex flex-col items-center justify-center p-10 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.1)_0%,transparent_70%)] animate-pulse"></div>
          
          <div className="w-24 h-24 mb-8 relative">
            <img src="https://cdn-icons-png.flaticon.com/512/3067/3067160.png" className="w-full h-full object-contain relative z-10 invert opacity-80" alt="" />
          </div>

          <h2 className="text-3xl font-black text-white tracking-[0.3em] mb-2 uppercase">V-Tor Engine</h2>
          <p className="text-[9px] text-purple-500 font-black uppercase tracking-[0.5em] mb-12">Deep Web sovereign gateway v3.5</p>

          <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
            <button onClick={() => navigateTo('Hidden Wiki')} className="p-5 glass border border-purple-500/20 rounded-3xl hover:bg-purple-500/10 transition-all text-left group">
              <div className="text-[10px] font-black text-white uppercase mb-1">Hidden Wiki</div>
              <div className="text-[7px] text-purple-400/60 uppercase">Directorio principal .onion</div>
            </button>
            <button onClick={() => navigateTo('https://duckduckgo.com')} className="p-5 glass border border-purple-500/20 rounded-3xl hover:bg-purple-500/10 transition-all text-left">
              <div className="text-[10px] font-black text-white uppercase mb-1">DuckDuckGo</div>
              <div className="text-[7px] text-purple-400/60 uppercase">Privacidad en Clearnet</div>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-grow flex flex-col relative">
          {isTunneling && (
            <div className="absolute inset-0 z-50 bg-[#080110] flex flex-col items-center justify-center space-y-6">
              <div className="w-20 h-20 rounded-full border-4 border-t-purple-500 border-purple-900 animate-spin"></div>
              <span className="text-[8px] font-black text-purple-500 uppercase tracking-[0.5em] animate-pulse">Saltando entre nodos...</span>
            </div>
          )}
          <iframe 
            src={searchTarget}
            className="w-full h-full border-none grayscale-[0.5] invert-[0.05]"
            title="Sovereign Tor Content"
          />
        </div>
      )}
    </div>
  );
};

export default TorBrowser;
