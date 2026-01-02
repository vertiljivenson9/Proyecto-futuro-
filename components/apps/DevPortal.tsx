import React, { useState, useEffect } from 'react';

interface DevPortalProps {
  initialPath?: string;
  onClose?: () => void;
}

const DevPortal: React.FC<DevPortalProps> = ({ initialPath, onClose }) => {
  const [mode, setMode] = useState<'setup' | 'idle'>('idle');
  const [params, setParams] = useState<any>(null);

  useEffect(() => {
    if (initialPath?.startsWith('setup:')) {
      try {
        const data = JSON.parse(atob(initialPath.replace('setup:', '')));
        setParams(data);
        setMode('setup');
      } catch (e) {
        console.error("Invalid parameters.");
      }
    }
  }, [initialPath]);

  const handleOpenStore = () => {
    window.dispatchEvent(new CustomEvent('open_system_app', { 
        detail: { appId: 'gerthastore', title: 'GerthaStore', icon: 'https://cdn-icons-png.flaticon.com/512/888/888846.png' }
    }));
    onClose?.();
  };

  return (
    <div className="flex flex-col h-full bg-[#08080a] text-white font-mono overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.03)_0%,transparent_70%)] pointer-events-none"></div>

      {mode === 'setup' ? (
        <div className="flex-grow flex flex-col items-center p-10 overflow-y-auto custom-scroll z-10">
          <div className="w-full max-w-xl glass p-10 rounded-[3rem] border border-indigo-500/20 shadow-2xl space-y-8 animate-in slide-in-from-bottom-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <h2 className="text-xl font-black uppercase tracking-widest text-indigo-400">Payment Setup</h2>
              <div className="text-[9px] bg-indigo-600/20 px-3 py-1 rounded-full uppercase font-black text-indigo-400 border border-indigo-500/20">Alpha Node</div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl space-y-3">
              <p className="text-[11px] text-amber-500 font-black uppercase tracking-widest">Sovereign Notification</p>
              <p className="text-[10px] text-white/60 leading-relaxed uppercase font-bold tracking-tight">
                Payment system coming soon. Your app "{params?.appName}" will be listed as free for now.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex justify-between text-[10px] font-black text-white/30 uppercase tracking-widest">
                <span>Target App:</span>
                <span className="text-white">{params?.appName}</span>
              </div>
              <div className="flex justify-between text-[10px] font-black text-white/30 uppercase tracking-widest">
                <span>Proposed Price:</span>
                <span className="text-white">${params?.price || 0} {params?.currency || 'USD'}</span>
              </div>
              <div className="flex justify-between text-[10px] font-black text-white/30 uppercase tracking-widest">
                <span>Vendor:</span>
                <span className="text-white">{params?.vendorEmail || 'free@vertilos.com'}</span>
              </div>
            </div>

            <div className="pt-8 space-y-4">
              <button 
                disabled
                className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-white/20 font-black uppercase text-[11px] tracking-widest cursor-not-allowed shadow-inner"
              >
                Submit to Store (Disabled)
              </button>
              
              <button 
                onClick={handleOpenStore}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white font-black uppercase text-[11px] tracking-widest transition-all shadow-xl active:scale-95"
              >
                Open GerthaStore
              </button>
              
              <p className="text-center text-[8px] text-white/20 uppercase font-bold tracking-[0.2em]">
                Paid uploads are currently restricted. Using local store bridge.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center opacity-5">
           <div className="text-9xl grayscale">🏪</div>
        </div>
      )}
    </div>
  );
};

export default DevPortal;