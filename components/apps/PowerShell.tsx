
import React, { useState, useEffect, useRef } from 'react';
import { saveFile, getInode } from '../../services/fs';
import { Kernel } from '../../services/kernel';

interface PowerShellProps {
  onClose?: () => void;
}

const PowerShell: React.FC<PowerShellProps> = ({ onClose }) => {
  const [history, setHistory] = useState<string[]>([
    "VertilOS Sovereign Shell [Stable Release 4.5.2]",
    "Identity: VERIFIED | Security: ACTIVE",
    "Welcome root. Type 'help' for available commands.",
    ""
  ]);
  const [input, setInput] = useState('');
  const [currentDir, setCurrentDir] = useState('/');
  const [isWorking, setIsWorking] = useState(false);
  
  // NANO EDITOR STATE
  const [nanoActive, setNanoActive] = useState(false);
  const [nanoFile, setNanoFile] = useState('');
  const [nanoBuffer, setNanoBuffer] = useState('');
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const nanoRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  useEffect(() => {
    if (nanoActive && nanoRef.current) nanoRef.current.focus();
  }, [nanoActive]);

  const addLine = (line: string) => setHistory(prev => [...prev, line]);

  const openNano = async (filename: string) => {
    setNanoFile(filename);
    const path = currentDir === '/' ? `/${filename}` : `${currentDir}/${filename}`;
    const existing = await getInode(path);
    setNanoBuffer(existing?.content || '');
    setNanoActive(true);
  };

  const saveNano = async () => {
    const path = currentDir === '/' ? `/${nanoFile}` : `${currentDir}/${nanoFile}`;
    await saveFile(path, nanoBuffer, 'com.vertil.user.files');
    setNanoActive(false);
    addLine(`[nano] Guardado ${nanoFile} y saliendo...`);
  };

  const processCommand = async (cmd: string) => {
    const cleanCmd = cmd.trim();
    if (!cleanCmd) return;

    addLine(`root@vertilos:${currentDir}# ${cleanCmd}`);
    
    const parts = cleanCmd.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    setIsWorking(true);

    try {
      const res = await Kernel.exec(command, args, currentDir);

      if (res.intent === 'clear') {
        setHistory([]);
      } else if (res.intent === 'open_nano') {
        if (!res.data) addLine("nano: falta el operando de archivo");
        else await openNano(res.data);
      } else {
        if (res.output) addLine(res.output);
      }

      if (command === 'cd' && args[0]) {
        if (args[0] === '..') {
            const parts = currentDir.split('/').filter(Boolean);
            parts.pop();
            setCurrentDir('/' + parts.join('/'));
        } else {
            const target = args[0].startsWith('/') ? args[0] : `${currentDir}${currentDir === '/' ? '' : '/'}${args[0]}`;
            // Validar si existe (simulado por ahora en cd)
            setCurrentDir(target);
        }
      }

    } catch (e: any) {
      addLine(`SHELL_ERROR: ${e.message}`);
    } finally {
      setIsWorking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isWorking) {
      processCommand(input);
      setInput('');
    }
  };

  if (nanoActive) {
    return (
      <div className="flex flex-col h-full bg-[#050505] font-mono text-white overflow-hidden border-t border-indigo-500/30">
        <div className="bg-indigo-600/20 px-4 py-1 flex justify-between items-center border-b border-white/10">
          <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">GNU nano 7.2 - Archivo: {nanoFile}</span>
          <div className="flex gap-4">
             <button onClick={saveNano} className="text-[8px] font-black bg-emerald-600 hover:bg-emerald-500 px-2 py-0.5 rounded transition-all">^O GUARDAR</button>
             <button onClick={() => setNanoActive(false)} className="text-[8px] font-black bg-red-600 hover:bg-red-500 px-2 py-0.5 rounded transition-all">^X SALIR</button>
          </div>
        </div>
        <textarea 
          ref={nanoRef}
          value={nanoBuffer}
          onChange={e => setNanoBuffer(e.target.value)}
          className="flex-grow bg-black p-6 outline-none resize-none text-[12px] text-emerald-400 font-bold leading-relaxed"
          spellCheck={false}
        />
        <div className="bg-white/5 p-2 text-[8px] flex gap-10 opacity-50 px-6 font-black uppercase tracking-tighter">
           <span>[^G] Ayuda</span>
           <span>[^O] Escribir</span>
           <span>[^W] Buscar</span>
           <span>[^X] Salir</span>
           <span>[^C] Posición</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#050505] text-emerald-500 font-mono text-[11px] p-6 overflow-hidden border-t-2 border-emerald-900/30" onClick={() => document.getElementById('shell-input')?.focus()}>
      <div className="flex-grow overflow-y-auto custom-scroll space-y-1 mb-4 select-text" ref={scrollRef}>
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap leading-relaxed opacity-90">
            {line.includes('#') ? <span className="text-emerald-400 font-black">{line}</span> : line}
          </div>
        ))}
        {isWorking && <div className="text-indigo-500 animate-pulse mt-2">[KERNEL] Procesando binario...</div>}
      </div>
      <div className="flex items-center gap-3 shrink-0 border-t border-white/5 pt-4">
        <span className="text-emerald-400 font-black">root@vertilos:{currentDir}#</span>
        <input 
          id="shell-input" 
          autoFocus 
          value={input} 
          disabled={isWorking} 
          onChange={e => setInput(e.target.value)} 
          onKeyDown={handleKeyDown} 
          className="flex-grow bg-transparent outline-none border-none text-white font-bold placeholder:opacity-20" 
          autoComplete="off" 
          spellCheck={false}
          placeholder="..."
        />
      </div>
    </div>
  );
};

export default PowerShell;
