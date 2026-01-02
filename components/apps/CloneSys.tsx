
import React, { useState } from 'react';
import { Kernel } from '../../services/kernel';

const REPO_OWNER = "vertiljivenson9";
const REPO_NAME = "Proyecto-futuro-";

const CloneSys: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'working' | 'done' | 'error'>('idle');
  const [log, setLog] = useState<string[]>([]);
  const [ghpToken, setGhpToken] = useState('');
  const [progress, setProgress] = useState(0);

  const addLog = (msg: string) => setLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const handlePushDNA = async () => {
    if (!ghpToken.startsWith('ghp_')) {
      addLog("ERROR: Se requiere un token GHP de GitHub.");
      return;
    }

    setStatus('working');
    setLog([]);
    setProgress(10);
    
    try {
      addLog("DNA_CORE: Succionando código fuente del entorno real...");
      const filesToPush = await Kernel.prepareGitFiles();
      setProgress(40);
      
      const headers = { 
        'Authorization': `token ${ghpToken}`,
        'Accept': 'application/vnd.github.v3+json'
      };

      addLog("GITHUB: Obteniendo estado de la rama main...");
      const refRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/refs/heads/main`, { headers });
      const refData = await refRes.json();
      const lastCommitSha = refData.object.sha;
      setProgress(60);

      addLog("GITHUB: Creando árbol atómico...");
      const treeEntries = filesToPush.map(f => ({
        path: f.path,
        mode: '100644',
        type: 'blob',
        content: f.content
      }));

      const treeRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/trees`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ tree: treeEntries })
      });
      const treeData = await treeRes.json();
      setProgress(80);

      addLog("GITHUB: Firmando nuevo commit soberano...");
      const commitRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/commits`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: `VERTILOS_MESH_SYNC_${Date.now()}`,
          tree: treeData.sha,
          parents: [lastCommitSha]
        })
      });
      const commitData = await commitRes.json();

      addLog("GITHUB: Actualizando HEAD (Push forzado)...");
      await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/refs/heads/main`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ sha: commitData.sha, force: true })
      });

      addLog("SUCCESS: El sistema se ha replicado con éxito.");
      setProgress(100);
      setStatus('done');
    } catch (e: any) {
      addLog(`ERROR: ${e.message}`);
      setStatus('error');
    }
  };

  return (
    <div className="flex flex-col h-full font-mono text-[10px] p-6 space-y-4 bg-[#020202]">
      <div className="p-6 bg-indigo-900/20 border border-indigo-500/30 rounded-[2.5rem] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-4xl">⚙️</div>
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-widest italic">Atomic CloneSys</h2>
            <p className="text-[8px] text-indigo-400 font-bold uppercase tracking-[0.4em]">Sincronización de ADN Real</p>
          </div>
        </div>
      </div>

      <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 space-y-6">
        <input 
          type="password"
          value={ghpToken}
          onChange={e => setGhpToken(e.target.value)}
          placeholder="GitHub Token (ghp_...)"
          className="w-full bg-black border border-white/10 p-5 rounded-3xl text-indigo-400 font-bold outline-none focus:border-indigo-500"
        />
        <button 
          onClick={handlePushDNA}
          disabled={status === 'working'}
          className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest transition-all shadow-xl active:scale-95 disabled:opacity-50"
        >
          {status === 'working' ? 'SINCRONIZANDO...' : 'REPLICAR NUCLEO A GITHUB'}
        </button>
      </div>

      <div className="flex-grow bg-black/80 border border-white/5 rounded-[3rem] p-8 overflow-y-auto custom-scroll text-indigo-300 space-y-1">
        {log.map((l, i) => <div key={i}> {l}</div>)}
      </div>
      
      {progress > 0 && (
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
      )}
    </div>
  );
};

export default CloneSys;
