import React, { useState, useRef, useEffect } from 'react';
import { Kernel } from '../../services/kernel';
export default function PowerShell({ onClose }) {
  const [history, setHistory] = useState(['VertilOS Shell v4.5', 'Type help for info', '']);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);
  useEffect(() => { if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [history]);
  const handleCmd = async (e) => {
    if(e.key === 'Enter') {
      const res = await Kernel.exec(input, []);
      setHistory(prev => [...prev, `root@vertilos# ${input}`, res.output || 'Done.']);
      setInput('');
    }
  };
  return <div className="h-full bg-black p-6 font-mono text-emerald-500 text-[11px] flex flex-col">
    <div ref={scrollRef} className="flex-grow overflow-auto mb-4">{history.map((l,i)=><div key={i}>{l}</div>)}</div>
    <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleCmd} className="bg-transparent outline-none border-none text-white" autoFocus />
  </div>;
}