
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const bootInitiated = useRef(false);

  const addLog = (msg: string) => setBootLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const runBootSequence = useCallback(async () => {
    if (bootInitiated.current) return;
    bootInitiated.current = true;

    addLog(">> VERTIL_BIOS_INIT v5.2 [STABLE_MESH]");
    
    // Watchdog de 6 segundos: Si algo falla, forzamos el escritorio
    const watchdog = setTimeout(() => {
      if (bootState === 'bios') {
        addLog("!! ALERTA: Watchdog activado. Forzando arranque de emergencia.");
        setBootState('desktop');
        const loader = document.getElementById('system-loader');
        if (loader) loader.style.display = 'none';
      }
    }, 6000);

    try {
      addLog("FS_CORE: Montando VFS IndexedDB...");
      await initFS();
      addLog("FS_CORE: OK. Inodos cargados.");

      addLog("REGISTRY: Cargando configuración de IP y Hardware...");
      const reg = await initRegistry();
      setRegistry(reg);
      addLog(`IDENTITY: ${reg.machine_id} [ONLINE]`);

      addLog("SECURITY: Verificando VertiLock...");
      const hasSecurity = await Kernel.checkSecurityStatus();
      
      addLog("UI: Hidratando componentes visuales...");
      await initAssets();
      
      clearTimeout(watchdog);
      await new Promise(r => setTimeout(r, 600)); // Efecto dramático controlado

      const loader = document.getElementById('system-loader');
      if (loader) loader.style.display = 'none';

      setBootState(hasSecurity ? 'login' : 'desktop');
    } catch (e: any) {
      clearTimeout(watchdog);
      addLog(`!! KERNEL_PANIC: ${e.message}`);
      // Permitir acceso de emergencia
      setTimeout(() => setBootState('desktop'), 2000);
    }
  }, [bootState]);

  useEffect(() => {
    runBootSequence();
    
    const handler = (e: Event) => e.preventDefault();
    document.addEventListener('contextmenu', handler, true);
    document.body.style.userSelect = 'none';

    return () => document.removeEventListener('contextmenu', handler, true);
  }, [runBootSequence]);

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
         <div className="text-white font-black mb-4 uppercase tracking-[0.5em] text-lg">Vertil Jivenson OS</div>
         {bootLogs.map((log, i) => <div key={i} className="opacity-80 animate-in fade-in slide-in-from-left-4 duration-300">{log}</div>)}
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
