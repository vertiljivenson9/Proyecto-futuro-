import React, { useState, useEffect, useRef } from 'react';
import { listDir } from '../../services/fs';

const PowerShell = ({ onClose }) => {
  const [history, setHistory] = useState(["Vertil PowerShell 3.0", "Type 'exit' to close", ""]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [history]);

  const exec = async (cmd) => {
    const c = cmd.trim().toLowerCase();
    if (c === 'exit') { onClose?.(); return; }
    setHistory(prev => [...prev, "PS> " + cmd]);
    if (c === 'ls') { const files = await listDir('/'); setHistory(prev => [...prev, ...files.map(f => f.name)]); }
    else if (c === 'clear') { setHistory([]); }
    else { setHistory(prev => [...prev, "Command not found: " + c]); }
  };

  return (
    <div className="h-full bg-black text-emerald-500 font-mono p-4 flex flex-col overflow-hidden">
      <div className="flex-grow overflow-auto mb-2" ref={scrollRef}>{history.map((l, i) => <div key={i}>{l}</div>)}</div>
      <div className="flex gap-2 border-t border-white/10 pt-2">
        <span>PS#</span>
        <input autoFocus value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if(e.key==='Enter') { exec(input); setInput(''); } }} className="bg-transparent outline-none flex-grow" />
      </div>
    </div>
  );
};
export default PowerShell;