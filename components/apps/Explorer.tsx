
import React, { useState, useEffect, useRef } from 'react';
import { listDir, deleteInode, getInode } from '../../services/fs';
import { Inode } from '../../types';

interface ExplorerProps {
  refreshRegistry?: () => void;
  onOpenFile?: (appId: string, title: string, icon: string, path: string) => void;
}

interface ContextMenu {
  x: number;
  y: number;
  item: Inode;
}

const Explorer: React.FC<ExplorerProps> = ({ refreshRegistry, onOpenFile }) => {
  const [path, setPath] = useState('/');
  const [items, setItems] = useState<Inode[]>([]);
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);

  const refresh = async () => {
    const data = await listDir(path);
    setItems(data);
  };

  useEffect(() => {
    refresh();
    const hideMenu = () => setContextMenu(null);
    window.addEventListener('click', hideMenu);
    return () => window.removeEventListener('click', hideMenu);
  }, [path]);

  const handleFileIntent = (item: Inode) => {
    if (item.type === 'directory') {
      setPath(item.path);
      return;
    }

    const ext = item.name.split('.').pop()?.toLowerCase();
    
    // GUIDE LOGIC: Open Instruction Manual for guide files
    if (item.name === 'master_guide.vpx' || item.name === 'instructions.vpx') {
      onOpenFile?.('manual', 'Instruction Manual', 'https://cdn-icons-png.flaticon.com/512/3524/3524659.png', item.path);
      return;
    }

    if (['mp3', 'mp4', 'wav', 'ogg', 'webm'].includes(ext || '')) {
      onOpenFile?.('mediaplayer', 'Media Player', 'https://cdn-icons-png.flaticon.com/512/716/716429.png', item.path);
    } else if (item.name.endsWith('.vpx')) {
      onOpenFile?.(`vpx_${item.id}`, item.name.replace('.vpx', ''), 'https://cdn-icons-png.flaticon.com/512/1005/1005141.png', item.path);
    } else {
      onOpenFile?.('texteditor', 'EFI Editor', 'https://cdn-icons-png.flaticon.com/512/2911/2911230.png', item.path);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, item: Inode) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, item });
  };

  return (
    <div className="flex flex-col h-full font-mono text-xs relative bg-black/40">
      <div className="p-3 bg-white/5 border-b border-white/10 flex items-center gap-3">
        <button onClick={() => setPath(path.substring(0, path.lastIndexOf('/')) || '/')} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">←</button>
        <div className="flex-grow bg-black/40 px-4 py-2 rounded-lg border border-white/5 text-white/60 truncate font-black tracking-widest">{path}</div>
      </div>

      <div className="flex-grow p-6 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-8 content-start overflow-y-auto custom-scroll">
        {items.map(item => (
          <div key={item.path} onClick={() => handleFileIntent(item)} onContextMenu={(e) => handleContextMenu(e, item)} className="flex flex-col items-center p-4 rounded-[2rem] cursor-pointer hover:bg-indigo-600/10 transition-all border border-transparent group">
            <div className={`text-5xl mb-4 group-hover:scale-110 transition-transform ${item.type === 'directory' ? 'text-indigo-400' : 'text-white/30'}`}>
              {item.type === 'directory' ? '📁' : item.name.endsWith('.vpx') ? '📦' : '📄'}
            </div>
            <span className="text-center font-black text-[8px] uppercase text-white/60 group-hover:text-white truncate w-full px-2 tracking-widest">{item.name}</span>
          </div>
        ))}
      </div>

      {contextMenu && (
        <div className="fixed z-[99999] glass border border-white/20 rounded-2xl py-2 shadow-2xl min-w-[180px]" style={{ top: contextMenu.y, left: contextMenu.x }}>
          <button onClick={() => handleFileIntent(contextMenu.item)} className="w-full text-left px-4 py-2 hover:bg-indigo-600 text-white text-[8px] font-black uppercase tracking-widest">Execute Intent</button>
          <button onClick={async () => { await deleteInode(contextMenu.item.path); refresh(); setContextMenu(null); }} className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-500/10 text-[8px] font-black uppercase tracking-widest">Purge Binary</button>
        </div>
      )}
    </div>
  );
};

export default Explorer;
