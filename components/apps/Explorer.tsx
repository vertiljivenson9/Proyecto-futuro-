import React, { useState, useEffect } from 'react';
import { listDir, deleteInode, saveFile } from '../../services/fs';
const Explorer = () => {
  const [path, setPath] = useState('/');
  const [items, setItems] = useState([]);
  useEffect(() => { listDir(path).then(setItems); }, [path]);
  return <div className="h-full flex flex-col font-mono bg-black/40">
    <div className="p-3 border-b border-white/10 flex gap-2">
      <button onClick={() => setPath('/')}>🏠</button>
      <div className="flex-grow bg-black/40 px-3 py-1 rounded-lg text-white/40">{path}</div>
    </div>
    <div className="p-6 grid grid-cols-4 gap-6">
      {items.map(i => <div key={i.path} onClick={() => i.type === 'directory' ? setPath(i.path) : null} className="flex flex-col items-center gap-2">
        <div className="text-4xl">{i.type === 'directory' ? '📁' : '📄'}</div>
        <span className="text-[8px] uppercase text-white/40">{i.name}</span>
      </div>)}
    </div>
  </div>;
};
export default Explorer;