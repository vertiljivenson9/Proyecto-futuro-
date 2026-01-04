import React, { useState, useEffect, useCallback } from 'react';
import Desktop from './components/Desktop';
import Login from './components/Login';
import { initFS } from './services/fs';
import { initRegistry } from './services/registry';
import { initAssets } from './services/assets';
import { Kernel } from './services/kernel';

export default function App() {
  const [bootState, setBootState] = useState('bios');
  const [windows, setWindows] = useState([]);
  const [registry, setRegistry] = useState(null);

  useEffect(() => {
    const boot = async () => {
      try {
        await initFS();
        const reg = await initRegistry();
        setRegistry(reg);
        await initAssets();
        const hasSec = await Kernel.checkSecurityStatus();
        setBootState(hasSec ? 'login' : 'desktop');
      } catch (e) { setBootState('desktop'); }
    };
    boot();
  }, []);

  const openWindow = useCallback((appId, title, icon, initialPath) => {
    setWindows(prev => {
      if (prev.find(w => w.appId === appId)) return prev;
      return [...prev, { id: crypto.randomUUID(), title, icon, appId, isOpen: true, zIndex: 100, x: 50, y: 50, width: 900, height: 600, initialPath }];
    });
  }, []);

  if (bootState === 'bios') return <div className="h-full bg-black flex items-center justify-center font-mono text-indigo-500">BOOTING_VERTILOS_SOVEREIGN...</div>;
  if (bootState === 'login') return <Login onUnlock={async p => { const ok = await Kernel.verifyPin(p); if(ok) setBootState('desktop'); return ok; }} onFileUnlock={async c => { const ok = await Kernel.verifyKeyFile(c); if(ok) setBootState('desktop'); return ok; }} />;
  
  return <Desktop registry={registry} windows={windows} setWindows={setWindows} onOpenWindow={openWindow} onPower={() => window.location.reload()} isAdmin={true} onValidateAdmin={() => true} />;
}