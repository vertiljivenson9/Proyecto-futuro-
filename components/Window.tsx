import React from 'react';
import AppLauncher from './AppLauncher';
const Window = ({ win, onClose }) => {
  return <div className="absolute glass rounded-xl overflow-hidden shadow-2xl border border-white/10" style={{ top: win.y, left: win.x, width: win.width, height: win.height, zIndex: win.zIndex }}>
    <div className="h-10 glass border-b border-white/5 flex items-center justify-between px-4">
      <span className="text-[10px] font-black uppercase text-white/90">{win.title}</span>
      <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500"></button>
    </div>
    <div className="flex-grow bg-black/80"><AppLauncher appId={win.appId} /></div>
  </div>;
};
export default Window;