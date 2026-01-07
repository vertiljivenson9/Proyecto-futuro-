import React, { useState, useEffect, useCallback, useRef } from 'react';
import Desktop from './components/Desktop';
import Login from './components/Login';
import { initFS } from './services/fs';
import { initRegistry, getRegistry } from './services/registry';
import { initAssets } from './services/assets';
import { Kernel } from './services/kernel';
const App = () => {
  const [bootState, setBootState] = useState('bios');
  const [windows, setWindows] = useState([]);
  const [registry, setRegistry] = useState(null);
  useEffect(() => {
    initFS().then(() => initRegistry()).then(reg => {
      setRegistry(reg);
      initAssets();
      Kernel.checkSecurityStatus().then(locked => {
        setTimeout(() => {
          const loader = document.getElementById('system-loader');
          if (loader) loader.style.display = 'none';
          setBootState(locked ? 'login' : 'desktop');
        }, 2000);
      });
    });
  }, []);
  return <Desktop registry={registry} windows={windows} setWindows={setWindows} />;
};
export default App;