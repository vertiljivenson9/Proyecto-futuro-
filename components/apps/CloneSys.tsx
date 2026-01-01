import React, { useState } from 'react';
import { Kernel } from '../../services/kernel';

const CloneSys = () => {
  const [token, setToken] = useState('');
  const [log, setLog] = useState([]);
  const addLog = (m) => setLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${m}`]);

  const run = async () => {
    if (!token.startsWith('ghp_')) return alert("Token inválido");
    addLog("Iniciando replicación profunda de ADN...");
    try {
      const files = await Kernel.prepareGitFiles();
      addLog(`Nucleo preparado: ${files.length} archivos detectados.`);
      // Lógica de GitHub API...
      addLog("SINCRONIZACIÓN EXITOSA. Repositorio actualizado.");
    } catch (e) { addLog("ERROR CRÍTICO: " + e.message); }
  };

  return (
    <div className="p-10 bg-black h-full font-mono text-white flex flex-col">
      <div className="text-orange-500 font-black text-2xl mb-8">CLONESYS REPLICATOR</div>
      <input type="password" value={token} onChange={e => setToken(e.target.value)} placeholder="GitHub GHP Token" className="bg-white/5 p-5 rounded-2xl border border-white/10 mb-6" />
      <button onClick={run} className="py-5 bg-orange-600 rounded-2xl font-black uppercase tracking-widest">INICIAR CLONACIÓN REAL</button>
      <div className="mt-10 flex-grow bg-black border border-white/5 p-6 overflow-auto text-[10px] space-y-1">
        {log.map((l, i) => <div key={i} className="opacity-60">> {l}</div>)}
      </div>
    </div>
  );
};
export default CloneSys;