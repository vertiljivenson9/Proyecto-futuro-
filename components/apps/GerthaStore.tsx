
import React, { useState, useEffect } from 'react';
import { listDir, saveFile } from '../../services/fs';

const GerthaStore: React.FC = () => {
  const [tab, setTab] = useState<'free' | 'paid'>('free');
  const [storeApps, setStoreApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [installing, setInstalling] = useState<string | null>(null);

  useEffect(() => {
    refreshStoreApps();
  }, []);

  const refreshStoreApps = async () => {
    setLoading(true);
    const apps = await listDir('/store');
    const parsed = apps.filter(f => f.name.endsWith('.vpx')).map(f => {
      try { 
        const data = JSON.parse(f.content || '{}'); 
        return { ...data, raw: f.content };
      } catch { return null; }
    }).filter(a => a !== null);
    
    setTimeout(() => {
      setStoreApps(parsed.filter(a => !a.pricing?.isPaid));
      setLoading(false);
    }, 600);
  };

  const handleInstall = async (app: any) => {
    setInstalling(app.title);
    try {
      await saveFile(`/user/apps/${app.id}.vpx`, app.raw, 'com.vertil.user.apps');
      await saveFile(`/apps/${app.id}.vpx`, app.raw, 'com.vertil.apps');
      
      setTimeout(() => {
        setInstalling(null);
        alert(`${app.title} has been installed successfully.`);
        window.location.reload(); 
      }, 1000);
    } catch (e) {
      alert("INSTALL_ERROR: Failed to write binary to VFS.");
      setInstalling(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] font-mono text-white overflow-hidden">
      <div className="h-20 bg-black/60 border-b border-white/5 flex items-center px-10 gap-12 shrink-0">
        <h2 className="text-sm font-black text-indigo-500 uppercase tracking-[0.3em] italic">GERTHA STORE 🏪</h2>
        <div className="flex gap-4">
          <button 
            onClick={() => setTab('free')}
            className={`px-8 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${tab === 'free' ? 'bg-indigo-600 text-white shadow-xl' : 'text-white/30 hover:bg-white/5'}`}
          >
            Free
          </button>
          <button 
            onClick={() => setTab('paid')}
            className={`px-8 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${tab === 'paid' ? 'bg-amber-600/20 text-amber-500 shadow-xl border border-amber-500/20' : 'text-white/30 hover:bg-white/5'}`}
          >
            Premium
          </button>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto custom-scroll p-10">
        {tab === 'paid' ? (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="text-7xl grayscale opacity-20">💰</div>
            <div className="bg-amber-500/10 border border-amber-500/20 p-8 rounded-[3rem] text-center max-w-sm">
               <h3 className="text-amber-500 font-black uppercase tracking-[0.3em] mb-4">Market Notice</h3>
               <p className="text-[10px] text-white/40 uppercase font-black tracking-widest leading-loose">
                 Paid apps coming soon. <br/> The Sovereign Market is preparing for atomic transactions.
               </p>
            </div>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-6 animate-pulse">
             <div className="w-16 h-16 border-4 border-t-indigo-500 border-indigo-500/10 rounded-full animate-spin"></div>
             <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Accessing Mesh Store...</span>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-20">
            {storeApps.map(app => (
              <div key={app.id} className="group glass border border-white/10 p-8 rounded-[3.5rem] flex flex-col items-center text-center gap-6 transition-all hover:scale-[1.02] hover:border-indigo-500/40">
                <div className="w-24 h-24 rounded-3xl bg-black/40 p-4 border border-white/5 shadow-2xl flex items-center justify-center">
                  <img src={app.icon} className="w-full h-full object-contain" alt="" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-black uppercase text-white tracking-widest truncate w-40">{app.title}</h3>
                  <p className="text-[7px] text-white/30 font-bold uppercase tracking-widest">{app.namespace}</p>
                </div>
                <p className="text-[9px] text-white/40 uppercase font-bold tracking-tight px-2 leading-relaxed h-10 overflow-hidden line-clamp-2">
                  {app.description || "No description provided."}
                </p>
                <div className="w-full pt-4">
                  <button 
                    onClick={() => handleInstall(app)}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest shadow-xl transition-all shadow-indigo-500/20"
                  >
                    Install Free
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {installing && (
        <div className="fixed inset-0 z-[60000] bg-black/90 flex flex-col items-center justify-center p-6 backdrop-blur-xl">
          <div className="max-w-xs w-full glass p-10 rounded-[4rem] border border-indigo-500/30 text-center space-y-8 shadow-2xl">
            <div className="w-16 h-16 border-4 border-t-indigo-500 border-indigo-900 rounded-full animate-spin mx-auto"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 block">Installing {installing}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GerthaStore;
