
import React, { useState, useEffect, useCallback } from 'react';
import Desktop from './components/Desktop';
import Login from './components/Login';
import { initFS, getFullFS } from './services/fs';
import { initRegistry, getRegistry } from './services/registry';
import { initAssets } from './services/assets';
import { Kernel } from './services/kernel';
import { WindowState } from './types';

const App: React.FC = () => {
  const [bootState, setBootState] = useState<'bios' | 'login' | 'desktop' | 'halt'>('bios');
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [registry, setRegistry] = useState<any>(null);

  const addLog = (msg: string) => setBootLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  useEffect(() => {
    const handler = (e: Event) => e.preventDefault();
    document.addEventListener('contextmenu', handler, true);
    document.body.style.userSelect = 'none';

    const unlockHandler = () => setBootState('desktop');
    window.addEventListener('system_unlocked', unlockHandler);

    return () => {
      document.removeEventListener('contextmenu', handler, true);
      window.removeEventListener('system_unlocked', unlockHandler);
    };
  }, []);

  const runBootSequence = useCallback(async () => {
    try {
      addLog(">> VERTIL_BIOS_INIT v4.5 [STABLE]");
      
      const hardware = {
        cores: navigator.hardwareConcurrency || 4,
        memory: (navigator as any).deviceMemory || 'UNK',
        agent: navigator.userAgent.split(') ')[0].split(' (')[1]
      };
      addLog(`HARDWARE: CPU[${hardware.cores}c] RAM[${hardware.memory}GB] HOST[${hardware.agent}]`);

      await initFS();
      const inodes = await getFullFS();
      addLog(`VFS_MOUNT: OK. ${inodes.length} INODES LOADED.`);

      const reg = await initRegistry();
      setRegistry(reg);
      addLog(`REGISTRY: DEVICE_ID [${reg.machine_id}] ONLINE.`);
      
      // Check Kernel for security status (filesystem + registry + localstorage)
      const hasSecurity = await Kernel.checkSecurityStatus();
      addLog(hasSecurity ? "SECURITY: AES_PERSISTENT_LOCK ACTIVE." : "SECURITY: OPEN_ACCESS.");

      await new Promise(r => setTimeout(r, 1200));

      const loader = document.getElementById('system-loader');
      if (loader) loader.style.display = 'none';

      setBootState(hasSecurity ? 'login' : 'desktop');
    } catch (e: any) {
      addLog(`!! KERNEL_PANIC: ${e.message}`);
      setBootState('halt');
    }
  }, []);

  useEffect(() => { 
    if (bootState === 'bios') runBootSequence(); 
  }, [bootState, runBootSequence]);

  const handlePowerAction = (action: 'shutdown' | 'suspend' | 'reboot') => {
    if (action === 'reboot') window.location.reload();
    if (action === 'shutdown') window.location.href = 'about:blank';
    if (action === 'suspend') setBootState('login');
  };

  const openWindow = useCallback((appId: string, title: string, icon: string, initialPath?: string) => {
    setWindows(prev => {
      const existing = prev.find(w => w.appId === appId);
      if (existing) {
        const maxZ = Math.max(100, ...prev.map(w => w.zIndex));
        return prev.map(w => w.appId === appId ? { ...w, isMinimized: false, zIndex: maxZ + 1 } : w);
      }
      return [...prev, {
        id: crypto.randomUUID(), title, icon, isOpen: true, isMinimized: false, isMaximized: false,
        zIndex: Math.max(100, ...prev.map(w => w.zIndex), 100) + 1,
        appId, initialPath, x: 50 + (prev.length * 30), y: 50 + (prev.length * 30), width: 900, height: 600
      }];
    });
  }, []);

  if (bootState === 'bios') return (
    <div className="h-full bg-black p-12 font-mono text-indigo-500 text-[11px] flex flex-col justify-end">
       <div className="space-y-1">
         <div className="text-white font-black mb-4 uppercase tracking-widest">VertilOS Boot Engine</div>
         {bootLogs.map((log, i) => <div key={i} className="opacity-80">{log}</div>)}
         <div className="w-3 h-5 bg-indigo-500 animate-pulse inline-block mt-4"></div>
       </div>
    </div>
  );

  if (bootState === 'login') return (
    <Login 
      onUnlock={async p => {
        const ok = await Kernel.verifyPin(p);
        if (ok) setBootState('desktop');
        return ok;
      }} 
      onFileUnlock={async c => {
        const ok = await Kernel.verifyKeyFile(c);
        if (ok) setBootState('desktop');
        return ok;
      }} 
    />
  );

  return <Desktop 
    registry={registry} 
    refreshRegistry={async () => setRegistry(await getRegistry())} 
    windows={windows} 
    setWindows={setWindows} 
    onOpenWindow={openWindow} 
    onPower={handlePowerAction} 
    isAdmin={true} 
    onValidateAdmin={p => String(p) === String(registry?.adminPin)} 
  />;
};

export default App;
