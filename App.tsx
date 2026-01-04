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
      const timeout = setTimeout(() => { setBootState('desktop'); document.getElementById('system-loader').style.display='none'; }, 4000);
      try {
        await initFS();
        const reg = await initRegistry();
        setRegistry(reg);
        const hasSec = await Kernel.checkSecurityStatus();
        clearTimeout(timeout);
        if(document.getElementById('system-loader')) document.getElementById('system-loader').style.display='none';
        setBootState(hasSec ? 'login' : 'desktop');
      } catch (e) { setBootState('desktop'); }
    };
    boot();
  }, []);

  const openWindow = (appId, title, icon) => {
    setWindows(prev => [...prev, { id: crypto.randomUUID(), title, icon, appId, isOpen: true, zIndex: 100, x: 50, y: 50, width: 900, height: 600 }]);
  };

  if (bootState === 'bios') return null;
  return <Desktop registry={registry} windows={windows} setWindows={setWindows} onOpenWindow={openWindow} />;
}