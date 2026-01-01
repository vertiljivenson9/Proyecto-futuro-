import React, { useState, useEffect, useCallback } from 'react';
import Window from './Window';
import { getInode, listDir } from '../services/fs';

const Desktop = ({ registry, refreshRegistry, windows, setWindows, onOpenWindow, onPower, isAdmin }) => {
  const [wallpaperUrl, setWallpaperUrl] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [vpxApps, setVpxApps] = useState([]);

  useEffect(() => {
    const load = async () => {
      const inode = await getInode('/user/wallpaper.img');
      if (inode?.content) setWallpaperUrl(inode.content);
      const apps = await listDir('/apps');
      setVpxApps(apps.filter(f => f.name.endsWith('.vpx')).map(f => JSON.parse(f.content)));
    };
    load();
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const apps = [
    { id: 'explorer', title: 'Archivos', icon: 'https://cdn-icons-png.flaticon.com/512/3767/3767084.png' },
    { id: 'clonesys', title: 'CloneSys', icon: 'https://cdn-icons-png.flaticon.com/512/2550/2550224.png' },
    { id: 'ide', title: 'Vertil Studio', icon: 'https://cdn-icons-png.flaticon.com/512/1005/1005141.png' },
    { id: 'powershell', title: 'Terminal', icon: 'https://cdn-icons-png.flaticon.com/512/2042/2042304.png' },
    { id: 'settings', title: 'Ajustes', icon: 'https://cdn-icons-png.flaticon.com/512/3524/3524659.png' },
  ];

  return (
    <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${wallpaperUrl})` }}>
      <div className="p-10 grid grid-cols-4 md:grid-cols-8 gap-10">
        {apps.map(app => (
          <button key={app.id} onClick={() => onOpenWindow(app.id, app.title, app.icon)} className="flex flex-col items-center gap-2 group">
            <div className="w-16 h-16 bg-black/40 rounded-2xl p-3 border border-white/10 group-hover:scale-110 transition-all"><img src={app.icon} className="w-full h-full object-contain" /></div>
            <span className="text-[9px] text-white font-bold uppercase">{app.title}</span>
          </button>
        ))}
      </div>
      {windows.map(win => <Window key={win.id} win={win} onClose={() => setWindows(prev => prev.filter(w => w.id !== win.id))} onFocus={() => {}} isAdmin={isAdmin} refreshRegistry={refreshRegistry} onOpenWindow={onOpenWindow} onPower={onPower} />)}
    </div>
  );
};
export default Desktop;