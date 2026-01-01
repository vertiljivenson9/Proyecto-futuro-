import React, { useState, useEffect, useRef } from 'react';
import { listDir } from '../../services/fs';
import { getRegistry } from '../../services/registry';
interface PowerShellProps { onClose?: () => void; }
const PowerShell: React.FC<PowerShellProps> = ({ onClose }) => {
  const [history, setHistory] = useState<string[]>(["Vertil PowerShell 3.0", "Type 'exit' to close", ""]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [history]);
  const processCommand = async (cmd: string) => {
    const clean = cmd.trim().toLowerCase();
    if (clean === 'exit') { onClose?.(); return; }
    setHistory(prev => [...prev, `PS> ${cmd}`]);
    if (clean === 'ls') {
      const files = await listDir('/');
      setHistory(prev => [...prev, ...files.map(f => f.name)]);
    } else if (clean === 'clear') { setHistory([]); }
    else { setHistory(prev => [...prev, `Command '${clean}' not found.`]); }
  };
  return (
    <div className="flex flex-col h-full bg-black text-emerald-500 font-mono text-[11px] p-4 overflow-hidden" onClick={() => document.getElementById('ps-input')?.focus()}>
      <div className="flex-grow overflow-y-auto custom-scroll mb-2" ref={scrollRef}>
        {history.map((line, i) => <div key={i}>{line}</div>)}
      </div>
      <div className="flex gap-2 border-t border-white/5 pt-2">
        <span className="text-indigo-500 font-bold">PS#</span>
        <input id="ps-input" autoFocus value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if(e.key === 'Enter') { processCommand(input); setInput(''); } }} className="flex-grow bg-transparent outline-none border-none text-emerald-400" />
      </div>
    </div>
  );
};
export default PowerShell;