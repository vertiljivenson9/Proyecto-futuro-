import React, { useState, useEffect, useRef } from 'react';
import { listDir } from '../../services/fs';

const PowerShell = ({ onClose }) => {
  const [history, setHistory] = useState(["Vertil PowerShell 3.0 [Sovereign Build]", "© Vertil Jivenson 2025. Nucleo Activo.", "Escriba 'exit' para cerrar.", ""]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [history]);

  const exec = async (cmd) => {
    const c = cmd.trim().toLowerCase();
    if (c === 'exit') { onClose?.(); return; }
    setHistory(prev => [...prev, "PS> " + cmd]);
    if (c === 'ls') { const files = await listDir('/'); setHistory(prev => [...prev, ...files.map(f => f.name)]); }
    else if (c === 'clear' || c === 'cls') { setHistory([]); }
    else if (c === 'neofetch') { setHistory(prev => [...prev, "OS: VertilOS 3.0", "Kernel: Sovereign v1.0", "Host: Sovereign Virtual Mesh"]); }
    else { setHistory(prev => [...prev, "ERROR: Comando no reconocido: " + c]); }
  };

  return (
    <div className="h-full bg-black text-emerald-500 font-mono text-[11px] p-4 flex flex-col overflow-hidden" onClick={() => document.getElementById('ps-input-real')?.focus()}>
      <div className="flex-grow overflow-auto mb-2 custom-scroll" ref={scrollRef}>{history.map((l, i) => <div key={i} className="mb-0.5">{l}</div>)}</div>
      <div className="flex gap-2 border-t border-white/10 pt-3">
        <span className="text-indigo-500 font-black">PS#</span>
        <input id="ps-input-real" autoFocus value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if(e.key==='Enter') { exec(input); setInput(''); } }} className="bg-transparent outline-none flex-grow text-emerald-400 font-bold" />
      </div>
    </div>
  );
};
export default PowerShell;