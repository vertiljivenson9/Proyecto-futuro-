import React from 'react';
import Window from './Window';
export default function Desktop({ registry, windows, setWindows, onOpenWindow }) {
  const apps = [{id:'explorer',t:'Explorer',i:'https://cdn-icons-png.flaticon.com/512/3767/3767084.png'},{id:'settings',t:'Settings',i:'https://cdn-icons-png.flaticon.com/512/3524/3524659.png'},{id:'clonesys',t:'CloneSys',i:'https://cdn-icons-png.flaticon.com/512/2550/2550224.png'}];
  return (
    <div className="h-full w-full bg-cover bg-center" style={{backgroundImage:`url(${registry?.wallpaper})` }}>
      <div className="p-10 grid grid-cols-6 gap-8">
        {apps.map(a => <button key={a.id} onClick={()=>onOpenWindow(a.id,a.t,a.i)} className="flex flex-col items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest group"><div className="w-16 h-16 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform"><img src={a.i} className="w-10 h-10" /></div>{a.t}</button>)}
      </div>
      {windows.map(w => <Window key={w.id} win={w} onClose={()=>setWindows(p=>p.filter(x=>x.id!==w.id))} />)}
    </div>
  );
}