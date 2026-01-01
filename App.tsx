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
  const [bootLog, setBootLog] = useState<string[]>([]);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [registry, setRegistry] = useState<any>(null);

  const addLog = useCallback((msg: string) => {
    setBootLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  }, []);

  const runBootSequence = useCallback(async () => {
    try {
      await initFS();
      const reg = await initRegistry();
      setRegistry(reg);
      await initAssets();
      const loader = document.getElementById('system-loader');
      if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
      }
      setTimeout(() => {
        if (reg.securityEnabled) setBootState('login');
        else setBootState('desktop');
      }, 800);
    } catch (e: any) {
      setTimeout(() => setBootState('desktop'), 2000);
    }
  }, []);

  useEffect(() => { runBootSequence(); }, [runBootSequence]);

  const openWindow = useCallback((appId: string, title: string, icon: string, initialPath?: string) => {
    setWindows(prev => {
      const existing = prev.find(w => w.appId === appId);
      if (existing) {
        const maxZ = Math.max(100, ...prev.map(w => w.zIndex));
        return prev.map(w => w.appId === appId ? { ...w, isMinimized: false, zIndex: maxZ + 1 } : w);
      }
      const newWin: WindowState = {
        id: crypto.randomUUID(), title, icon, isOpen: true, isMinimized: false, isMaximized: false,
        zIndex: Math.max(100, ...prev.map(w => w.zIndex), 100) + 1,
        appId, initialPath, x: 60 + (prev.length * 20), y: 60 + (prev.length * 20),
        width: 850, height: 550
      };
      return [...prev, newWin];
    });
  }, []);

  if (bootState === 'bios') return <div className="bg-black h-full" />;
  if (bootState === 'login') return <Login onUnlock={async p => Kernel.verifyPin(p)} onFileUnlock={async c => Kernel.verifyKeyFile(c)} />;
  return <Desktop registry={registry} refreshRegistry={async () => setRegistry(await getRegistry())} windows={windows} setWindows={setWindows} onOpenWindow={openWindow} onPower={() => window.location.reload()} isAdmin={true} onValidateAdmin={p => String(p) === String(registry?.adminPin)} />;
};
export default App;