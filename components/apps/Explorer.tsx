import React, { useState, useEffect } from 'react';
import { listDir } from '../../services/fs';
export default function Explorer({ onOpenFile }) {
  const [items, setItems] = useState([]);
  useEffect(() => { listDir('/').then(setItems); }, []);
  return (
    <div className="p-6 grid grid-cols-4 gap-6 font-mono">
      {items.map(i => (
        <div key={i.path} onClick={() => onOpenFile(i.id, i.name, '')} className="flex flex-col items-center gap-2 cursor-pointer group">
          <div className="text-4xl group-hover:scale-110 transition-all">📄</div>
          <span className="text-[9px] text-white/60 uppercase text-center truncate w-full">{i.name}</span>
        </div>
      ))}
    </div>
  );
}