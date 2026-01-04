import React from 'react';
import AppLauncher from './AppLauncher';
export default function Window({ win, onClose }) {
  return (
    <div className="absolute glass rounded-xl border border-white/10 shadow-2xl flex flex-col overflow-hidden" style={{ top: win.y, left: win.x, width: win.width, height: win.height, zIndex: win.zIndex }}>
      <div className="h-10 border-b border-white/5 flex items-center justify-between px-4 bg-white/5 cursor-grab">
        <span className="text-[9px] font-black uppercase tracking-widest text-white/80">{win.title}</span>
        <button onClick={onClose} className="text-red-500 font-bold">×</button>
      </div>
      <div className="flex-grow bg-black/60 overflow-auto"><AppLauncher appId={win.appId} /></div>
    </div>
  );
}