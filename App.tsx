import React, { useState, useEffect, useCallback, useRef } from 'react';
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
    initFS()
      .then(() => initRegistry())
      .then(r => { setRegistry(r); return initAssets(); })
      .then(() => Kernel.checkSecurityStatus())
      .then(s => setBootState(s ? 'login' : 'desktop'));
  }, []);

  const openWindow = useCallback((appId, title, icon, initialPath) => {
    setWindows(prev => {
      if (prev.find(w => w.appId === appId)) return prev;
      return [...prev, { id: crypto.randomUUID(), title, icon, appId, isOpen: true, zIndex: 100, x: 50, y: 50, width: 900, height: 600 }];
    });
  }, []);

  if (bootState === 'bios') return <div className="h-full bg-black flex items-center justify-center font-mono text-indigo-500">BOOTING_VERTILOS_CORE...</div>;
  if (bootState === 'login') return <Login onUnlock={async p => Kernel.verifyPin(p)} onFileUnlock={async c => Kernel.verifyKeyFile(c)} />;
  
  return <Desktop registry={registry} windows={windows} setWindows={setWindows} onOpenWindow={openWindow} onPower={() => window.location.reload()} isAdmin={true} onValidateAdmin={() => true} />;
}