import React from 'react';
import Window from './Window';
export default function Desktop({ registry, windows, setWindows, onOpenWindow }) {
  const apps = [{ id: 'explorer', title: 'Explorer', icon: 'https://cdn-icons-png.flaticon.com/512/3767/3767084.png' }, { id: 'clonesys', title: 'CloneSys', icon: 'https://cdn-icons-png.flaticon.com/512/2550/2550224.png' }, { id: 'powershell', title: 'Shell', icon: 'https://cdn-icons-png.flaticon.com/512/2042/2042304.png' }];
  return (
    <div className="h-full w-full relative bg-cover bg-center bg-black" style={{ backgroundImage: `url(${registry?.wallpaper})` }}>
      <div className="p-10 grid grid-cols-4 sm:grid-cols-6 gap-8">
        {apps.map(app => (
          <button key={app.id} onClick={() => onOpenWindow(app.id, app.title, app.icon)} className="flex flex-col items-center gap-2 group">
            <div className="w-16 h-16 bg-black/40 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-all"><img src={app.icon} className="w-10 h-10" /></div>
            <span className="text-[10px] text-white font-black uppercase tracking-widest">{app.title}</span>
          </button>
        ))}
      </div>
      {windows.map(win => <Window key={win.id} win={win} onClose={() => setWindows(prev => prev.filter(w => w.id !== win.id))} />)}
    </div>
  );
}