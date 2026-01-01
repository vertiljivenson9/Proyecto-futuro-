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
    addLog("VERTIL_BIOS v23.5: INITIATING COLD BOOT...");
    try {
      await initFS();
      addLog("STORAGE: VFS MOUNTED AT /ROOT");
      const reg = await initRegistry();
      setRegistry(reg);
      addLog("SECURITY: MACHINE_ID VERIFIED");
      await initAssets();
      addLog("KERNEL: HANDOVER TO USER_SPACE...");
      const loader = document.getElementById('system-loader');
      if (loader) { loader.style.opacity = '0'; setTimeout(() => loader.style.display = 'none', 500); }
      setTimeout(() => { if (reg.securityEnabled) setBootState('login'); else setBootState('desktop'); }, 800);
    } catch (e: any) {
      addLog(`CRITICAL: KERNEL_PANIC - ${e.message}`);
      setTimeout(() => setBootState('desktop'), 2000);
    }
  }, [addLog]);

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
        zIndex: Math.max(100, ...prev.map(w => w.zIndex), 100) + 1, appId, initialPath,
        x: 60 + (prev.length * 20), y: 60 + (prev.length * 20), width: 850, height: 550
      };
      return [...prev, newWin];
    });
  }, []);

  if (bootState === 'bios') return (
    <div className="h-full w-full bg-[#000] p-12 font-mono text-indigo-500 flex flex-col justify-end">
      <div className="max-w-4xl space-y-1">
        <div className="text-white font-black text-3xl mb-10 flex items-center gap-6">VERTIL OS</div>
        <div className="space-y-1 border-l border-indigo-500/20 pl-6 h-48 overflow-hidden">
          {bootLog.map((log, i) => <div key={i} className="text-[10px] opacity-70">{log}</div>)}
        </div>
      </div>
    </div>
  );

  if (bootState === 'login') return <Login onUnlock={async (pin) => { const v = await Kernel.verifyPin(pin); if(v) setBootState('desktop'); return v; }} onFileUnlock={async (c) => { const v = await Kernel.verifyKeyFile(c); if(v) setBootState('desktop'); return v; }} />;

  return <Desktop registry={registry} refreshRegistry={async () => setRegistry(await getRegistry())} windows={windows} setWindows={setWindows} onOpenWindow={openWindow} onPower={() => window.location.reload()} isAdmin={true} onValidateAdmin={(pin) => String(pin) === String(registry?.adminPin)} />;
};

export default App;