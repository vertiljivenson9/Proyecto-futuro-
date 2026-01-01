import React, { useState } from 'react';
import { Kernel } from '../../services/kernel';

const CloneSys = () => {
  const [token, setToken] = useState('');
  const [log, setLog] = useState([]);
  const addLog = m => setLog(p => [...p, m]);

  const handlePush = async () => {
    addLog("Iniciando replicación...");
    const files = await Kernel.prepareGitFiles();
    addLog(`Archivos preparados: ${files.length}`);
    // Lógica de GitHub API...
    addLog("Sincronización simulada completada (Usa token real para producción)");
  };

  return (
    <div className="p-10 bg-black h-full font-mono text-white text-[10px]">
      <input type="password" value={token} onChange={e => setToken(e.target.value)} className="w-full bg-white/5 p-4 rounded-xl mb-4 border border-white/10" placeholder="GitHub GHP Token" />
      <button onClick={handlePush} className="w-full py-4 bg-orange-600 rounded-xl font-black">REPLICAR ADN A GITHUB</button>
      <div className="mt-10 space-y-2">{log.map((l, i) => <div key={i}>> {l}</div>)}</div>
    </div>
  );
};
export default CloneSys;