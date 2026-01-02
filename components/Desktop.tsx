
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { WindowState } from '../types';
import Window from './Window';
import { listDir } from '../services/fs';

interface DesktopProps {
  registry: any;
  refreshRegistry: () => void;
  windows: WindowState[];
  setWindows: React.Dispatch<React.SetStateAction<WindowState[]>>;
  onOpenWindow: (id: string, title: string, icon: string, initialPath?: string) => void;
  onPower: (action: 'shutdown' | 'suspend' | 'reboot') => void;
  isAdmin: boolean;
  onValidateAdmin: (pin: string) => boolean;
}

const Desktop: React.FC<DesktopProps> = ({ registry, refreshRegistry, windows, setWindows, onOpenWindow, onPower, isAdmin, onValidateAdmin }) => {
  const [vpxApps, setVpxApps] = useState<any[]>([]);

  const wallpaperStyle = useMemo(() => ({
    backgroundImage: `url(${registry?.wallpaper || 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1974'})`,
    backgroundSize: 'cover', backgroundPosition: 'center', transition: 'background-image 0.8s ease'
  }), [registry?.wallpaper]);

  const loadVpxApps = useCallback(async () => {
    const userAppsInFS = await listDir('/user/apps');
    const systemAppsInFS = await listDir('/apps');
    
    const combined = [...systemAppsInFS, ...userAppsInFS];
    const unique = Array.from(new Map(combined.map(item => [item.name, item])).values());

    const loadedVpx = unique.filter(f => f.name.endsWith('.vpx')).map(f => {
      try { 
        const data = JSON.parse(f.content || '{}');
        return { ...data, path: f.path };
      } catch { return null; }
    }).filter(a => a !== null);
    setVpxApps(loadedVpx);
  }, []);

  useEffect(() => { 
    loadVpxApps();
    
    const handleOpenSystemApp = (e: any) => {
      const { appId, title, icon, initialPath } = e.detail;
      onOpenWindow(appId, title, icon, initialPath);
    };
    window.addEventListener('open_system_app', handleOpenSystemApp);
    return () => window.removeEventListener('open_system_app', handleOpenSystemApp);
  }, [loadVpxApps, onOpenWindow]);

  const systemApps = [
    { id: 'explorer', title: 'Explorer', icon: 'https://cdn-icons-png.flaticon.com/512/3767/3767084.png' },
    { id: 'gerthastore', title: 'GerthaStore', icon: 'https://cdn-icons-png.flaticon.com/512/888/888846.png', emoji: '🏪' },
    { id: 'ide', title: 'Studio', icon: 'https://cdn-icons-png.flaticon.com/512/1005/1005141.png' },
    { id: 'powershell', title: 'Terminal', icon: 'https://cdn-icons-png.flaticon.com/512/2042/2042304.png' },
    { id: 'settings', title: 'Settings', icon: 'https://cdn-icons-png.flaticon.com/512/3524/3524659.png' },
    { id: 'clonesys', title: 'CloneSys', icon: 'https://cdn-icons-png.flaticon.com/512/2550/2550224.png' },
    { id: 'replicator', title: 'Replicator', icon: 'https://cdn-icons-png.flaticon.com/512/2906/2906206.png' },
    { id: 'docs', title: 'Kernel Docs', icon: 'https://cdn-icons-png.flaticon.com/512/2991/2991106.png', emoji: '📖' },
    { id: 'profile', title: 'Identity', icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' },
    { id: 'about', title: 'About', icon: 'https://cdn-icons-png.flaticon.com/512/189/189664.png' },
    { id: 'vertiflix', title: 'VertiFlix', icon: 'https://cdn-icons-png.flaticon.com/512/3163/3163478.png' },
    { id: 'videoport', title: 'VideoPort', icon: 'https://cdn-icons-png.flaticon.com/512/716/716429.png' },
    { id: 'regeditprocess', title: 'RegEditProcess', icon: 'https://cdn-icons-png.flaticon.com/512/2911/2911230.png' },
    { id: 'googlesearch', title: 'Search', icon: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' },
    { id: 'netmonitor', title: 'Network', icon: 'https://cdn-icons-png.flaticon.com/512/2906/2906274.png' },
    { id: 'torbrowser', title: 'Tor Browser', icon: 'https://cdn-icons-png.flaticon.com/512/3067/3067160.png' },
    { id: 'devportal', title: 'Dev Portal', icon: 'https://cdn-icons-png.flaticon.com/512/606/606203.png' },
    { id: 'vault', title: 'Vault', icon: 'https://cdn-icons-png.flaticon.com/512/2592/2592201.png' },
    { id: 'texteditor', title: 'EFI Editor', icon: 'https://cdn-icons-png.flaticon.com/512/2911/2911230.png' }
  ];

  const focusWindow = (id: string) => {
    setWindows(prev => {
      const maxZ = Math.max(100, ...prev.map(w => w.zIndex));
      return prev.map(w => w.id === id ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w);
    });
  };

  const updateWindow = useCallback((id: string, updates: Partial<WindowState>) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  }, [setWindows]);

  return (
    <div className="h-full w-full relative overflow-hidden flex flex-col select-none" style={wallpaperStyle}>
      <div className="flex-grow overflow-y-auto p-12 custom-scroll z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div id="desktop-grid" className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-x-8 gap-y-12">
            {systemApps.map(app => (
              <button 
                key={app.id} 
                onClick={() => onOpenWindow(app.id, app.title, app.icon)} 
                className="desktop-icon flex flex-col items-center group space-y-3 outline-none"
                data-app-id={app.id}
                data-app-title={app.title}
                data-is-system="true"
              >
                <div className="w-16 h-16 rounded-[1.8rem] bg-black/40 p-4 border border-white/5 backdrop-blur-2xl group-hover:scale-110 group-hover:bg-indigo-600/40 transition-all duration-300 shadow-2xl active:scale-95 flex items-center justify-center">
                  {app.emoji ? (
                    <span className="text-3xl">{app.emoji}</span>
                  ) : (
                    <img src={app.icon} className="w-full h-full object-contain" alt="" />
                  )}
                </div>
                <span className="text-white text-[9px] font-black uppercase tracking-widest text-center opacity-40 group-hover:opacity-100 transition-all truncate w-full px-2">{app.title}</span>
              </button>
            ))}
            
            {vpxApps.map(app => (
              <button 
                key={app.id} 
                onClick={() => onOpenWindow(`vpx_${app.id}`, app.title, app.icon)} 
                className="desktop-icon flex flex-col items-center group space-y-3 outline-none animate-in fade-in zoom-in duration-300"
                data-app-id={`vpx_${app.id}`}
                data-app-title={app.title}
                data-is-system="false"
                data-vpx-path={app.path}
              >
                <div className="w-16 h-16 rounded-[1.8rem] bg-emerald-500/10 p-4 border border-emerald-500/20 backdrop-blur-2xl group-hover:scale-110 group-hover:bg-emerald-500/30 transition-all duration-300 shadow-2xl active:scale-95">
                  <img src={app.icon} className="w-full h-full object-contain" alt="" />
                </div>
                <span className="text-emerald-400 text-[9px] font-black uppercase tracking-widest text-center opacity-40 group-hover:opacity-100 transition-all truncate w-full px-2">{app.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {windows.map(win => (
        <Window 
          key={win.id} win={win} isAdmin={isAdmin} refreshRegistry={() => { refreshRegistry(); loadVpxApps(); }} 
          onOpenWindow={onOpenWindow} onPower={onPower}
          onClose={() => setWindows(prev => prev.filter(w => w.id !== win.id))}
          onMinimize={() => updateWindow(win.id, { isMinimized: true })}
          onMaximize={() => updateWindow(win.id, { isMaximized: !win.isMaximized })}
          onFocus={() => focusWindow(win.id)}
          updatePosition={(id, x, y) => updateWindow(id, { x, y })}
        />
      ))}

      <div className="h-20 glass border-t border-white/5 flex items-center px-10 justify-between z-[20000] backdrop-blur-3xl">
        <div className="flex items-center gap-10">
          <div 
            onClick={() => onPower('reboot')} 
            className="w-12 h-12 bg-indigo-600 rounded-[1.2rem] flex items-center justify-center font-black text-2xl shadow-2xl hover:scale-110 hover:bg-indigo-500 transition-all cursor-pointer active:scale-90"
            title="Reiniciar Kernel"
          >
            V
          </div>
          <div className="flex gap-4">
            {windows.map(win => (
              <button key={win.id} onClick={() => focusWindow(win.id)} className={`w-12 h-12 rounded-2xl flex items-center justify-center p-3 transition-all ${win.isMinimized ? 'opacity-20 scale-90' : 'bg-white/5 border border-white/10 shadow-lg'}`}>
                <img src={win.icon} className="w-full h-full object-contain" alt="" />
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-8">
           <div className="text-right flex flex-col justify-center">
              <span className="text-white text-[10px] font-black tracking-widest uppercase">{registry?.current_ip}</span>
              <span className="text-indigo-400 text-[8px] font-black tracking-[0.3em] uppercase">{registry?.systemInfo?.os}</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Desktop;
