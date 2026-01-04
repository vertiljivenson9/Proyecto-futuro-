import React, { useState, useEffect, useCallback, useRef } from 'react';
import Desktop from './components/Desktop';
import Login from './components/Login';
import { initFS, getInode } from './services/fs';
import { initRegistry, getRegistry } from './services/registry';
import { initAssets } from './services/assets';
import { Kernel } from './services/kernel';

export default function App() {
  const [bootState, setBootState] = useState('bios');
  const [bootLogs, setBootLogs] = useState([]);
  const [windows, setWindows] = useState([]);
  const [registry, setRegistry] = useState(null);
  const bootInitiated = useRef(false);

  const addLog = (msg) => setBootLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const runBootSequence = useCallback(async () => {
    if (bootInitiated.current) return;
    bootInitiated.current = true;
    addLog(">> VERTIL_BIOS_BOOT_MANAGER v6.1");
    try {
      await initFS();
      addLog("VFS_MOUNT: Sistema de archivos virtual montado.");
      const reg = await initRegistry();
      setRegistry(reg);
      await initAssets();
      const hasSecurity = await Kernel.checkSecurityStatus();
      const loader = document.getElementById('system-loader');
      if (loader) loader.style.display = 'none';
      setBootState(hasSecurity ? 'login' : 'desktop');
    } catch (e) {
      addLog(`!! FALLO: ${e.message}`);
      setBootState('desktop');
    }
  }, []);

  useEffect(() => { runBootSequence(); }, [runBootSequence]);

  const openWindow = useCallback((appId, title, icon, initialPath) => {
    setWindows(prev => {
      if (prev.find(w => w.appId === appId)) return prev;
      return [...prev, { id: crypto.randomUUID(), title, icon, appId, isOpen: true, x: 50, y: 50, width: 900, height: 600, zIndex: 100, initialPath }];
    });
  }, []);

  if (bootState === 'bios') return <div className="h-full bg-black p-10 font-mono text-indigo-400 text-[10px]">{bootLogs.map((l,i)=><div key={i}>{l}</div>)}</div>;
  if (bootState === 'login') return <Login onUnlock={async p => { const ok = await Kernel.verifyPin(p); if(ok) setBootState('desktop'); return ok; }} onFileUnlock={async c => { const ok = await Kernel.verifyKeyFile(c); if(ok) setBootState('desktop'); return ok; }} />;
  
  return <Desktop registry={registry} windows={windows} setWindows={setWindows} onOpenWindow={openWindow} onPower={() => window.location.reload()} />;
}