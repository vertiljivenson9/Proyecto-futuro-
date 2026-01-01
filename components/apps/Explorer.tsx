import React, { useState, useEffect, useRef } from 'react';
import { listDir, deleteInode, saveFile } from '../../services/fs';

const Explorer = ({ onOpenFile }) => {
  const [path, setPath] = useState('/');
  const [items, setItems] = useState([]);
  const fileInputRef = useRef(null);

  const refresh = async () => setItems(await listDir(path));
  useEffect(() => { refresh(); }, [path]);

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      await saveFile(`${path === '/' ? '' : path}/${file.name}`, ev.target.result, 'com.vertil.user');
      refresh();
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-full bg-black/40 font-mono text-xs">
      <div className="p-3 bg-white/5 border-b border-white/10 flex items-center gap-3">
        <button onClick={() => setPath(path.substring(0, path.lastIndexOf('/')) || '/')} className="px-3 py-1 bg-white/5 rounded">←</button>
        <div className="flex-grow truncate opacity-40">{path}</div>
        <button onClick={() => fileInputRef.current?.click()} className="px-3 py-1 bg-indigo-600 rounded">IMPORTAR</button>
        <input type="file" ref={fileInputRef} className="hidden" onChange={handleImport} />
      </div>
      <div className="p-4 grid grid-cols-4 gap-4 overflow-auto">
        {items.map(i => (
          <div key={i.path} onClick={() => i.type === 'directory' ? setPath(i.path) : onOpenFile?.('texteditor', 'Editor', '', i.path)} className="flex flex-col items-center p-4 rounded-xl hover:bg-white/5 cursor-pointer">
            <div className="text-4xl mb-2">{i.type === 'directory' ? '📁' : '📄'}</div>
            <div className="text-center truncate w-full">{i.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Explorer;