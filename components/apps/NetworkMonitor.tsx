
import React, { useState, useEffect } from 'react';

const NetworkMonitor: React.FC = () => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [scanning, setScanning] = useState(false);

  const scanNetwork = () => {
    setScanning(true);
    setNodes([]);
    
    // Simulación de descubrimiento de red real mediante broadcast virtual
    setTimeout(() => {
      const discovered = [
        { id: 'NODE-042', ip: '192.168.1.105', mac: 'D4:A1:C2:55:E1:01', status: 'Online', type: 'VertilStation' },
        { id: 'NODE-109', ip: '192.168.1.112', mac: '00:1B:44:11:3A:B7', status: 'Secured', type: 'Sovereign-Server' },
        { id: 'NODE-998', ip: '192.168.1.201', mac: 'FF:EE:DD:CC:BB:AA', status: 'Encrypted', type: 'Gateway-Node' }
      ];
      setNodes(discovered);
      setScanning(false);
    }, 2500);
  };

  useEffect(() => {
    scanNetwork();
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#050505] font-mono text-xs p-5">
      <div className="flex items-center justify-between mb-8 border-b border-indigo-500/30 pb-4">
        <div>
          <h2 className="text-indigo-400 font-black uppercase text-sm tracking-widest">Mesh Discovery v2.9</h2>
          <p className="text-white/30 text-[8px] uppercase">Detectando nodos soberanos en el segmento actual</p>
        </div>
        <button 
          onClick={scanNetwork}
          disabled={scanning}
          className={`px-4 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all ${scanning ? 'bg-indigo-900/40 text-indigo-500 animate-pulse' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20'}`}
        >
          {scanning ? 'Escaneando Malla...' : 'Refrescar Malla'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {nodes.map(node => (
          <div key={node.id} className="glass border border-white/5 p-4 rounded-2xl flex items-center justify-between group hover:border-indigo-500/40 transition-all">
            <div className="flex items-center gap-5">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-white/5 ${node.status === 'Online' ? 'text-emerald-500' : 'text-indigo-500'}`}>
                {node.type === 'VertilStation' ? '💻' : '🛡️'}
              </div>
              <div>
                <div className="text-white font-black uppercase text-[10px] tracking-widest">{node.id}</div>
                <div className="flex items-center gap-3 mt-1 text-[8px] font-bold">
                  <span className="text-white/30">{node.ip}</span>
                  <span className="text-white/10">|</span>
                  <span className="text-indigo-400/60">{node.mac}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-[8px] font-black uppercase tracking-widest ${node.status === 'Online' ? 'text-emerald-500' : 'text-indigo-400'}`}>
                {node.status}
              </div>
              <div className="text-[7px] text-white/20 uppercase mt-1">{node.type}</div>
            </div>
          </div>
        ))}
        
        {nodes.length === 0 && !scanning && (
          <div className="flex flex-col items-center justify-center py-20 opacity-20 italic">
            <div className="text-5xl mb-4">📡</div>
            <div className="uppercase tracking-[0.3em] text-[10px]">No se detectaron nodos en este segmento.</div>
          </div>
        )}
      </div>

      <div className="mt-auto p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-xl">
        <div className="flex justify-between items-center text-[8px] font-black uppercase text-indigo-400 mb-2">
          <span>Sovereign Bridge Status</span>
          <span className="animate-pulse">Active</span>
        </div>
        <div className="h-1 bg-black/40 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 w-3/4 animate-expand-width duration-[2s]"></div>
        </div>
      </div>
    </div>
  );
};

export default NetworkMonitor;
