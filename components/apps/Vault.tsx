
import React from 'react';

const Vault: React.FC = () => {
  return (
    <div className="h-full flex flex-col p-6">
      <div className="bg-indigo-900/20 border border-indigo-500/30 p-6 rounded-2xl flex items-center gap-6 mb-8">
        <div className="text-4xl">🔐</div>
        <div>
          <h2 className="text-white font-black uppercase tracking-widest text-sm">Secure Vault Area</h2>
          <p className="text-white/40 text-[9px] uppercase mt-1">AES-256 Memory-only isolation is active.</p>
        </div>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4 opacity-30 italic">
        <div className="text-6xl mb-4">🛡️</div>
        <p className="text-xs uppercase font-black tracking-widest">No secret keys detected in Level 0.</p>
        <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] uppercase font-black tracking-widest hover:bg-white/10 transition-all">
          Generate New Keypair
        </button>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
          <div className="text-xs text-white/40 uppercase mb-2">Encryption</div>
          <div className="text-indigo-400 font-black">X25519</div>
        </div>
        <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
          <div className="text-xs text-white/40 uppercase mb-2">Integrity</div>
          <div className="text-indigo-400 font-black">BLAKE2s</div>
        </div>
      </div>
    </div>
  );
};

export default Vault;
