import React, { useState, useEffect } from 'react';
import { listDir, deleteInode } from '../../services/fs';

const Explorer = ({ onOpenFile }) => {
  const [items, setItems] = useState([]);
  const [path, setPath] = useState('/');
  useEffect(() => { listDir(path).then(setItems); }, [path]);
  return (
    <div className="p-6 text-white font-mono text-[10px]">
      <div className="mb-4 text-indigo-400">Ruta: {path}</div>
      <div className="grid grid-cols-4 gap-4">
        {items.map(i => (
          <div key={i.path} onClick={() => i.type === 'directory' ? setPath(i.path) : onOpenFile?.('texteditor', 'Editor', '', i.path)} className="p-4 border border-white/10 rounded-xl cursor-pointer hover:bg-white/5">
            <div>{i.type === 'directory' ? '📁' : '📄'}</div>
            <div className="truncate">{i.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Explorer;