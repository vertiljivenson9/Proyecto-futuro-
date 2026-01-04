import React, { useState, useEffect } from 'react';
import { updateRegistry, getRegistry } from '../../services/registry';
import { listDir } from '../../services/fs';
export default function Settings({ refreshRegistry }) {
  const [reg, setReg] = useState(null);
  const [wps, setWps] = useState([]);
  useEffect(() => {
    getRegistry().then(setReg);
    listDir('/system/wallpapers').then(setWps);
  }, []);
  const setW = async (url) => { await updateRegistry({ wallpaper: url }); refreshRegistry(); setReg(await getRegistry()); };
  if(!reg) return null;
  return (
    <div className="p-8 bg-black text-white h-full overflow-auto space-y-10">
      <h2 className="text-indigo-400 font-black uppercase tracking-widest border-l-4 border-indigo-600 pl-4 italic">FONDOS SOBERANOS</h2>
      <div className="grid grid-cols-4 gap-6">
        {wps.map((wp, i) => (
          <button key={i} onClick={() => setW(wp.content)} className={`aspect-video rounded-2xl overflow-hidden border-2 transition-all ${reg.wallpaper === wp.content ? 'border-indigo-500 scale-95' : 'border-white/5'}`}>
            <img src={wp.content} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}