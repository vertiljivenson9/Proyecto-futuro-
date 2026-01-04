import React, { useState, useEffect } from 'react';
import { listDir } from '../../services/fs';
export default function Explorer() {
  const [it, setIt] = useState([]);
  useEffect(() => { listDir('/').then(setIt); }, []);
  return <div className="p-6 grid grid-cols-4 gap-6 font-mono text-white text-[10px] uppercase font-black">{it.map(i => <div key={i.path} className="flex flex-col items-center gap-2"><span>📄</span>{i.name}</div>)}</div>;
}