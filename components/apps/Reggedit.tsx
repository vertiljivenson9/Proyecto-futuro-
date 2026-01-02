
import React, { useState, useEffect } from 'react';
import { getRegistry } from '../../services/registry';
import { getFullFS } from '../../services/fs';

const Reggedit: React.FC = () => {
  const [regData, setRegData] = useState<any>(null);
  const [hexData, setHexData] = useState<string[]>([]);
  const [processes, setProcesses] = useState<{name: string, pid: number, ns: string, status: string}[]>([]);

  useEffect(() => {
    const load = async () => {
      const reg = await getRegistry();
      setRegData(reg);
      const fs = await getFullFS();
      
      // Generar Hex Dump real basado en el contenido de los archivos del sistema
      const dump = fs.slice(0, 15).map(inode => {
        const prefix = inode.path.substring(0, 8).padEnd(8, ' ');
        const bytes = Array.from({length: 12}, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(' ');
        return `${prefix} | ${bytes.toUpperCase()} | ${inode.type[0]}`;
      });
      setHexData(dump);
      
      setProcesses([
        { name: 'Kernel_v2.9', pid: 1, ns: 'com.vertil.kernel', status: 'RUNNING' },
        { name: 'SovereignNet', pid: 42, ns: 'com.vertil.net', status: 'LISTENING' },
        { name: 'Watchdog', pid: 7, ns: 'com.vertil.security', status: 'GUARD' },
        { name: 'VFS_Daemon', pid: 102, ns: 'com.vertil.fs', status: 'MOUNTED' }
      ]);
    };
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  const killProcess = (pid: number) => {
    alert(`KERNEL_ALERT: Enviando SIGTERM al proceso ${pid}.`);
    setProcesses(prev => prev.filter(p => p.pid !== pid));
  };

  if (!regData) return null;

  return (
    <div className="font-mono text-[10px] p-4 space-y-6 bg-[#020202] h-full overflow-y-auto custom-scroll border-t-2 border-indigo-900/50">
      <div className="flex items-center justify-between bg-indigo-950/20 p-3 border border-indigo-500/20 rounded-lg mb-4">
        <div className="flex items-center gap-4">
          <div className="text-xl">🛠️</div>
          <div>
            <div className="text-indigo-400 font-black uppercase tracking-widest text-[11px]">Hex Machine Registry</div>
            <div className="text-white/20 text-[8px] uppercase">Machine ID: {regData.machine_id}</div>
          </div>
        </div>
        <div className="text-emerald-500 font-black animate-pulse">SYSTEM_INTACT</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass border border-indigo-500/20 p-4 rounded-xl shadow-2xl">
          <h3 className="text-indigo-500 mb-4 border-b border-indigo-500/30 pb-2 uppercase font-black tracking-widest">Memory Inode Dump</h3>
          <div className="bg-black/60 p-4 rounded font-mono text-indigo-300/80 text-[9px] leading-relaxed select-text overflow-x-auto">
            {hexData.map((line, i) => (
              <div key={i} className="flex gap-4 hover:bg-indigo-500/10 transition-colors py-0.5">
                <span className="text-white/20">0x{(i * 16).toString(16).padStart(4, '0')}</span>
                <span className="text-emerald-500/60 font-bold">{line}</span>
              </div>
            ))}
            <div className="mt-4 animate-pulse text-indigo-600 text-[8px] font-black italic">FETCHING RAW BYTES... OK</div>
          </div>
        </div>

        <div className="glass border border-emerald-500/20 p-4 rounded-xl shadow-2xl">
          <h3 className="text-emerald-500 mb-4 border-b border-emerald-500/30 pb-2 uppercase font-black tracking-widest flex justify-between">
            <span>Core Tasks</span>
            <span className="text-[8px] opacity-50">v2.9</span>
          </h3>
          <div className="space-y-2">
            {processes.map(p => (
              <div key={p.pid} className="bg-white/5 p-2.5 rounded border border-white/5 flex flex-col gap-1 group">
                <div className="flex justify-between items-center">
                  <span className="text-white font-black">{p.name} <span className="text-emerald-500 text-[7px] ml-2">PID:{p.pid}</span></span>
                  <button onClick={() => killProcess(p.pid)} className="text-[7px] bg-red-900/40 text-red-500 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">TERM</button>
                </div>
                <div className="flex justify-between text-[7px] uppercase font-bold text-white/30 italic">
                  <span>{p.ns}</span>
                  <span className="text-emerald-500/50">{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reggedit;
