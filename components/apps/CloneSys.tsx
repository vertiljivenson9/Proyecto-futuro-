
import React, { useState, useEffect } from 'react';
import { Kernel } from '../../services/kernel';

const REPO_OWNER = "vertiljivenson9";
const REPO_NAME = "Proyecto-futuro-";

const CloneSys: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'working' | 'done' | 'error'>('idle');
  const [log, setLog] = useState<string[]>([]);
  const [ghpToken, setGhpToken] = useState('');
  const [progress, setProgress] = useState(0);
  const [dnaFiles, setDnaFiles] = useState<string[]>([]);

  useEffect(() => {
    setDnaFiles(Kernel.getSystemDNA());
  }, []);

  const addLog = (msg: string) => setLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const handlePushDNA = async () => {
    if (!ghpToken.startsWith('ghp_')) {
      addLog("ERROR: Token GHP inválido. Se requiere acceso de escritura.");
      return;
    }

    setStatus('working');
    setLog([]);
    setProgress(5);
    addLog(`ATOMIC_PUSH_V5.1: Iniciando saneamiento de ADN y replicación.`);
    
    try {
      const headers = { 
        'Authorization': `token ${ghpToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      };

      // 1. Saneamiento y Auto-hidratación
      addLog("DNA_CORE: Ejecutando auto-hidratación de inodos críticos...");
      await Kernel.syncDNA(true); // El nuevo Kernel ahora succiona el código real
      setProgress(25);

      // 2. Capturar archivos del VFS saneados
      const filesToPush = await Kernel.prepareGitFiles();
      
      // Validación extra para JSONs críticos
      const criticalJson = filesToPush.find(f => f.path === 'package.json' || f.path === 'wrangler.json');
      if (criticalJson && criticalJson.content.startsWith('//')) {
         throw new Error("DNA_INTEGRITY_FAIL: Archivos JSON corruptos detectados. Abortando Push para proteger el Build.");
      }

      addLog(`VFS_SCAN: ${filesToPush.length} archivos validados para transferencia.`);
      setProgress(40);

      // 3. Obtener el SHA de la rama actual
      const refRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/refs/heads/main`, { headers });
      if (!refRes.ok) throw new Error("REPO_ACCESS_ERROR: No se pudo conectar con GitHub.");
      const refData = await refRes.json();
      const lastCommitSha = refData.object.sha;
      setProgress(55);

      // 4. Crear el Árbol (Reemplazo Total y Limpio)
      const treeEntries = filesToPush.map(f => ({
        path: f.path,
        mode: '100644',
        type: 'blob',
        content: f.content
      }));

      addLog(`DNA_TREE: Construyendo árbol atómico sin herencia...`);
      const treeRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/trees`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ tree: treeEntries }) 
      });
      
      const treeData = await treeRes.json();
      if (!treeRes.ok) throw new Error(`TREE_API_ERROR: ${treeData.message}`);
      
      addLog("DNA_TREE: Árbol verificado y listo.");
      setProgress(75);

      // 5. Crear el Commit
      const commitRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/commits`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: `VERTILOS_MESH_FIXED_BUILD_${new Date().getTime()}`,
          tree: treeData.sha,
          parents: [lastCommitSha]
        })
      });
      const commitData = await commitRes.json();
      if (!commitRes.ok) throw new Error("COMMIT_ERROR: Fallo al firmar el ADN.");
      setProgress(90);

      // 6. Push forzado
      const patchRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/refs/heads/main`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ sha: commitData.sha, force: true })
      });

      if (!patchRes.ok) throw new Error("REF_PATCH_ERROR: Fallo en actualización de HEAD.");

      addLog(`SUCCESS: Repositorio saneado. Build en Cloudflare debería ser exitoso.`);
      setProgress(100);
      setStatus('done');
    } catch (e: any) {
      addLog(`CRITICAL: ${e.message}`);
      setStatus('error');
    }
  };

  return (
    <div className="flex flex-col h-full font-mono text-[10px] p-6 space-y-4 bg-[#020202]">
      <div className="p-6 bg-indigo-900/20 border border-indigo-500/30 rounded-[2.5rem] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-4xl animate-pulse">⚙️</div>
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-widest italic">Atomic Build Fixer</h2>
            <p className="text-[8px] text-indigo-400 font-bold uppercase tracking-[0.4em]">ADN MESH: Auto-hidratación Activa</p>
          </div>
        </div>
        <div className="text-right">
           <div className="text-white/20 text-[7px] uppercase tracking-widest">Repo: {REPO_NAME}</div>
        </div>
      </div>

      <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 space-y-6">
        <div className="space-y-2">
          <label className="text-[8px] text-indigo-400 uppercase font-black ml-4">GitHub Authorization Token</label>
          <input 
            type="password"
            value={ghpToken}
            onChange={e => setGhpToken(e.target.value)}
            placeholder="ghp_************************************"
            className="w-full bg-black border border-white/10 p-5 rounded-3xl text-indigo-400 font-bold outline-none focus:border-indigo-500 text-sm transition-all"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
           <button 
            onClick={handlePushDNA}
            disabled={status === 'working'}
            className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest transition-all shadow-xl active:scale-95 disabled:opacity-50"
          >
            {status === 'working' ? 'SANEANDO Y SUBIENDO...' : 'REPARAR BUILD Y PUSH'}
          </button>
          
          <button 
            onClick={() => Kernel.syncDNA(true).then(() => addLog("AUTO_HYDRATE: Sincronizado con código fuente real."))}
            className="w-full py-3 bg-white/5 border border-white/10 rounded-2xl text-white/40 font-black uppercase text-[8px] tracking-widest hover:text-white transition-all"
          >
            Sincronizar VFS con Código Fuente (Hydrate)
          </button>
        </div>
      </div>

      <div className="flex-grow bg-black/80 border border-white/5 rounded-[3rem] p-8 overflow-y-auto custom-scroll text-indigo-300 space-y-2">
        {log.map((l, i) => (
          <div key={i} className="flex gap-4 border-l-2 border-indigo-900/30 pl-4 py-1">
            <span className="text-indigo-900 font-black">{(i+1).toString().padStart(2,'0')}</span>
            <span className="opacity-80 font-bold tracking-tight">{l}</span>
          </div>
        ))}
        {status === 'error' && <div className="text-red-500 font-black uppercase mt-4 animate-pulse px-4 py-2 bg-red-900/10 rounded-xl border border-red-500/20">!! ERROR: BUILD_INTEGRITY_COMPROMISED !!</div>}
      </div>
      
      {progress > 0 && (
        <div className="h-2 bg-white/5 rounded-full overflow-hidden mx-4">
          <div className="h-full bg-indigo-500 shadow-[0_0_10px_#4f46e5] transition-all duration-700" style={{ width: `${progress}%` }}></div>
        </div>
      )}
    </div>
  );
};

export default CloneSys;
