import React, { useState, useEffect, useCallback, useRef } from 'react';
import Desktop from './components/Desktop';
import Login from './components/Login';
import { initFS } from './services/fs';
import { initRegistry, getRegistry } from './services/registry';
import { Kernel } from './services/kernel';

const App = () => {
  const [bootState, setBootState] = useState('bios');
  const [windows, setWindows] = useState([]);
  const [registry, setRegistry] = useState(null);
  const bootInitiated = useRef(false);

  useEffect(() => {
    if (bootInitiated.current) return;
    bootInitiated.current = true;
    initFS().then(() => initRegistry()).then(reg => {
      setRegistry(reg);
      Kernel.checkSecurityStatus().then(isLocked => {
        setTimeout(() => {
          const loader = document.getElementById('system-loader');
          if (loader) loader.style.display = 'none';
          setBootState(isLocked ? 'login' : 'desktop');
        }, 2000);
      });
    });
  }, []);

  if (bootState === 'bios') return <div className="bg-black h-full">BIOS LOADING...</div>;
  if (bootState === 'login') return <Login onUnlock={p => Kernel.verifyPin(p)} />;
  return <Desktop registry={registry} windows={windows} setWindows={setWindows} onPower={() => window.location.reload()} />;
};
export default App;