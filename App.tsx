import React, { useState, useEffect, useCallback } from 'react';
import Desktop from './components/Desktop';
import Login from './components/Login';
import { initFS } from './services/fs';
import { initRegistry, getRegistry } from './services/registry';
import { initAssets } from './services/assets';
import { Kernel } from './services/kernel';
import { WindowState } from './types';

const App: React.FC = () => {
  const [bootState, setBootState] = useState<'bios' | 'login' | 'desktop'>('bios');
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [registry, setRegistry] = useState<any>(null);

  useEffect(() => {
    const boot = async () => {
      await initFS();
      const reg = await initRegistry();
      setRegistry(reg);
      await initAssets();
      const loader = document.getElementById('system-loader');
      if (loader) { loader.style.opacity = '0'; setTimeout(() => loader.style.display = 'none', 500); }
      setBootState(reg.securityEnabled ? 'login' : 'desktop');
    };
    boot();
  }, []);

  const openWindow = useCallback((appId: string, title: string, icon: string, initialPath?: string) => {
    setWindows(prev => {
      const existing = prev.find(w => w.appId === appId);
      if (existing) return prev.map(w => w.appId === appId ? { ...w, isMinimized: false, zIndex: Math.max(...prev.map(x=>x.zIndex), 100)+1 } : w);
      return [...prev, { id: crypto.randomUUID(), title, icon, isOpen: true, isMinimized: false, isMaximized: false, zIndex: 101 + prev.length, appId, initialPath, x: 50+(prev.length*20), y: 50+(prev.length*20), width: 850, height: 550 }];
    });
  }, []);

  if (bootState === 'bios') return <div className="bg-black h-full" />;
  if (bootState === 'login') return <Login onUnlock={async p => { const v = await Kernel.verifyPin(p); if(v) setBootState('desktop'); return v; }} onFileUnlock={async c => { const v = await Kernel.verifyKeyFile(c); if(v) setBootState('desktop'); return v; }} />;
  return <Desktop registry={registry} refreshRegistry={async () => setRegistry(await getRegistry())} windows={windows} setWindows={setWindows} onOpenWindow={openWindow} onPower={() => window.location.reload()} isAdmin={true} onValidateAdmin={p => String(p) === String(registry?.adminPin)} />;
};
export default App;