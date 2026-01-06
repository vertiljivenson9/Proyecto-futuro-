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
  
  useEffect(() => {
    initFS().then(() => initRegistry()).then(reg => {
      setRegistry(reg);
      Kernel.checkSecurityStatus().then(locked => {
        setTimeout(() => setBootState(locked ? 'login' : 'desktop'), 2000);
      });
    });
  }, []);

  if (bootState === 'bios') return <div className="bg-black h-full text-indigo-500 p-10 font-mono">BIOS LOADING...</div>;
  if (bootState === 'login') return <Login onUnlock={p => Kernel.verifyPin(p)} />;
  return <Desktop registry={registry} windows={windows} setWindows={setWindows} />;
};
export default App;