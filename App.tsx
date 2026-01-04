import React, { useState, useEffect, useCallback, useRef } from 'react';
import Desktop from './components/Desktop';
import Login from './components/Login';
import { initFS } from './services/fs';
import { initRegistry } from './services/registry';
import { Kernel } from './services/kernel';

export default function App() {
  const [bootState, setBootState] = useState('bios');
  const [windows, setWindows] = useState([]);
  const [registry, setRegistry] = useState(null);
  const bootCalled = useRef(false);

  useEffect(() => {
    if (bootCalled.current) return;
    bootCalled.current = true;
    
    const boot = async () => {
      const safety = setTimeout(() => { setBootState('desktop'); if(document.getElementById('system-loader')) document.getElementById('system-loader').style.display='none'; }, 4000);
      try {
        await initFS();
        const reg = await initRegistry();
        setRegistry(reg);
        const hasSec = await Kernel.checkSecurityStatus();
        clearTimeout(safety);
        if(document.getElementById('system-loader')) document.getElementById('system-loader').style.display='none';
        setBootState(hasSec ? 'login' : 'desktop');
      } catch (e) {
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
  if (bootState === 'login') return <Login onUnlock={async p => (await Kernel.verifyPin(p)) && setBootState('desktop')} onFileUnlock={async c => (await Kernel.verifyKeyFile(c)) && setBootState('desktop')} />;
  return <Desktop registry={registry} windows={windows} setWindows={setWindows} onOpenWindow={openWindow} />;
}