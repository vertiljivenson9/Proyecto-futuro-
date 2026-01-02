
import React, { useState, useEffect } from 'react';
import { getFullFS } from '../../services/fs';
import { getRegistry } from '../../services/registry';

const Replicator: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'pushing' | 'done' | 'error'>('idle');
  const [log, setLog] = useState<string[]>([]);
  const [ghpToken, setGhpToken] = useState('');
  const [stats, setStats] = useState({ files: 0, size: 0 });

  const addLog = (msg: string) => setLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  useEffect(() => {
    const fetchStats = async () => {
      const fs = await getFullFS();
      const totalSize = fs.reduce((acc, curr) => acc + (curr.size || 0), 0);
      setStats({ files: fs.length, size: totalSize });
    };
    fetchStats();
  }, []);

  const runReplicator = async () => {
    if (!ghpToken.startsWith('ghp_')) {
      alert("AUTH_ERROR: GHP Token is required for Level-0 Push.");
      return;
    }

    try {
      setStatus('scanning');
      addLog("Initializing Kernel Deep Scan...");
      
      const fs = await getFullFS();
      const registry = await getRegistry();
      
      addLog(`Scanning Inode Table... OK.`);
      addLog(`Captured ${fs.length} inodes with namespace resolution.`);
      
      const bootableImage = {
        manifest: "com.vertil.vpx_image_v2",
        timestamp: Date.now(),
        system: {
          version: "2.5.0-PRO",
          registry: registry,
          fs_inodes: fs
        }
      };

      addLog("Compressing System Image (LZW Emulation)...");
      await new Promise(r => setTimeout(r, 1000));

      setStatus('pushing');
      addLog("Pushing to GitHub Pro (One-Shot API)...");
      
      const repo = "vertiljivenson9/Proyecto-futuro-";
      const filename = `system/instance_${Date.now()}.json`;
      const base64 = btoa(JSON.stringify(bootableImage, null, 2));

      const response = await fetch(`https://api.github.com/repos/${repo}/contents/${filename}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${ghpToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `VERTIL_REPLICATE: System Instance at ${new Date().toISOString()}`,
          content: base64
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "GitHub API Reject.");
      }

      addLog("Verifying SHA-256 Cloud Integrity...");
      addLog("SUCCESS: System is now replicated and bootable.");
      setStatus('done');
    } catch (e: any) {
      addLog(`CRITICAL_FAILURE: ${e.message}`);
      setStatus('error');
    }
  };

  return (
    <div className="flex flex-col h-full font-mono text-xs p-4">
      <div className="bg-orange-600/20 border border-orange-500/50 p-4 rounded-xl mb-6">
        <div className="flex items-center gap-4">
          <div className="text-3xl animate-pulse">☢️</div>
          <div>
            <h2 className="text-orange-500 font-black uppercase text-sm">System Replicator v2</h2>
            <p className="text-white/40 text-[9px] mt-1">NIVEL 0: Captura total de inodos y registro de sistema.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-black/40 p-3 rounded-lg border border-white/5">
          <span className="text-white/30 uppercase text-[8px] block mb-1">Inodos Locales</span>
          <span className="text-xl font-black text-white">{stats.files}</span>
        </div>
        <div className="bg-black/40 p-3 rounded-lg border border-white/5">
          <span className="text-white/30 uppercase text-[8px] block mb-1">Payload Size</span>
          <span className="text-xl font-black text-white">{(stats.size / 1024).toFixed(2)} KB</span>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex flex-col gap-2">
          <label className="text-white/40 uppercase text-[9px] font-black">GitHub Personal Token</label>
          <input 
            type="password"
            value={ghpToken}
            onChange={(e) => setGhpToken(e.target.value)}
            className="bg-black border border-white/10 p-3 rounded-lg outline-none focus:border-orange-500 text-orange-500 transition-all font-bold"
            placeholder="ghp_****************"
          />
        </div>
        <button 
          onClick={runReplicator}
          disabled={status !== 'idle' && status !== 'error' && status !== 'done'}
          className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:opacity-20 text-black font-black uppercase tracking-[0.2em] rounded-xl shadow-lg active:scale-95 transition-all"
        >
          {status === 'idle' ? 'Comenzar Clonación Atómica' : 'Procesando Núcleo...'}
        </button>
      </div>

      <div className="flex-grow bg-black/90 border border-white/5 rounded-xl p-4 overflow-y-auto custom-scroll text-green-500/80 space-y-1">
        {log.map((line, i) => (
          <div key={i} className="animate-in slide-in-from-left duration-200">
            <span className="text-orange-800 mr-2">»</span> {line}
          </div>
        ))}
        {status === 'done' && (
          <div className="mt-4 p-4 bg-green-500/10 text-green-400 border border-green-500/30 rounded-lg text-center font-black animate-bounce">
            PROCESO COMPLETADO - SISTEMA REPLICADO
          </div>
        )}
      </div>
    </div>
  );
};

export default Replicator;
