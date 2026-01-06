import React from 'react';
import Window from './Window';
const Desktop = ({ registry, windows, setWindows, onOpenWindow, onPower }) => {
  return <div className="h-full w-full relative overflow-hidden" style={{ backgroundImage: `url(${registry?.wallpaper})`, backgroundSize: 'cover' }}>
    {windows.map(win => <Window key={win.id} win={win} onClose={() => setWindows(p => p.filter(w => w.id !== win.id))} />)}
    <div className="absolute bottom-0 w-full h-20 bg-black/40 backdrop-blur-md border-t border-white/10 flex items-center px-6">
       <button onClick={() => onPower('reboot')} className="w-12 h-12 bg-indigo-600 rounded-xl text-white font-black">V</button>
    </div>
  </div>;
};
export default Desktop;