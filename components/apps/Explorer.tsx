import React, { useState, useEffect } from 'react';
import { listDir } from '../../services/fs';
export default function Explorer() {
  const [items, setItems] = useState([]);
  useEffect(() => { listDir('/').then(setItems); }, []);
  return <div className="p-6 grid grid-cols-4 gap-6 font-mono text-white">{items.map(i => <div key={i.path} className="flex flex-col items-center gap-2"><span>📄</span><span className="text-[9px] uppercase">{i.name}</span></div>)}</div>;
}