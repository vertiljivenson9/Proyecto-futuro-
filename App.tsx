import React, { useState, useEffect, useCallback } from 'react';
import Desktop from './components/Desktop';
import Login from './components/Login';
import { initFS } from './services/fs';
import { initRegistry } from './services/registry';
import { Kernel } from './services/kernel';

export default function App() {
  const [bootState, setBootState] = useState('bios');
  const [windows, setWindows] = useState([]);
  const [registry, setRegistry] = useState(null);

  useEffect(() => {
    const boot = async () => {
      // Safety timeout to prevent infinite loading
      const safety = setTimeout(() => setBootState('desktop'), 5000);
      try {
        await initFS();
        const reg = await initRegistry();
        setRegistry(reg);
        const hasSec = await Kernel.checkSecurityStatus();
        clearTimeout(safety);
        const loader = document.getElementById('system-loader');
        if (loader) loader.style.display = 'none';
        setBootState(hasSec ? 'login' : 'desktop');
      } catch (e) {
        console.error("Boot failure, bypassing...", e);
        setBootState('desktop');
      }
    };
    boot();
  }, []);

  const openWindow = useCallback((appId, title, icon, initialPath) => {
    setWindows(prev => {
      if (prev.find(w => w.appId === appId)) return prev;
      return [...prev, { id: crypto.randomUUID(), title, icon, appId, isOpen: true, zIndex: 100, x: 50, y: 50, width: 900, height: 600, initialPath }];
    });
  }, []);

  if (bootState === 'bios') return null;
  if (bootState === 'login') return <Login onUnlock={async p => (await Kernel.verifyPin(p)) && setBootState('desktop')} />;
  return <Desktop registry={registry} windows={windows} setWindows={setWindows} onOpenWindow={openWindow} />;
}