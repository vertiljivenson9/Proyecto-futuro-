import React, { useState, useEffect, useCallback, useRef } from 'react';
import Desktop from './components/Desktop';
import Login from './components/Login';
import { initFS } from './services/fs';
import { initRegistry, getRegistry } from './services/registry';
import { initAssets } from './services/assets';
import { Kernel } from './services/kernel';

const App = () => {
  const [bootState, setBootState] = useState('bios');
  const [bootLogs, setBootLogs] = useState([]);
  const [windows, setWindows] = useState([]);
  const [registry, setRegistry] = useState(null);
  const bootInitiated = useRef(false);

  const addLog = (msg) => setBootLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const runBootSequence = useCallback(async () => {
    if (bootInitiated.current) return;
    bootInitiated.current = true;
    addLog(">> VERTIL_BIOS_BOOT_MANAGER v6.8");
    try {
      await initFS();
      const reg = await initRegistry();
      setRegistry(reg);
      await initAssets();
      const isLocked = await Kernel.checkSecurityStatus();
      setTimeout(() => {
        const loader = document.getElementById('system-loader');
        if (loader) loader.style.display = 'none';
        setBootState(isLocked ? 'login' : 'desktop');
      }, 2000);
    } catch (e) { setBootState('desktop'); }
  }, []);

  useEffect(() => { runBootSequence(); }, [runBootSequence]);

  const openWindow = (appId, title, icon, initialPath) => {
    setWindows(prev => {
      const existing = prev.find(w => w.appId === appId);
      if (existing) return prev.map(w => w.appId === appId ? { ...w, isMinimized: false, zIndex: 999 } : w);
      return [...prev, { id: crypto.randomUUID(), title, icon, isOpen: true, appId, initialPath, x: 50, y: 50, width: 900, height: 600, zIndex: 100 }];
    });
  };

  if (bootState === 'bios') return <div className="h-full bg-black p-10 font-mono text-indigo-400 text-[10px] flex flex-col justify-end">{bootLogs.map((l, i) => <div key={i}>{l}</div>)}</div>;
  if (bootState === 'login') return <Login onUnlock={async p => await Kernel.verifyPin(p)} onFileUnlock={async c => await Kernel.verifyKeyFile(c)} />;
  return <Desktop registry={registry} windows={windows} setWindows={setWindows} onOpenWindow={openWindow} onPower={() => window.location.reload()} />;
};
export default App;