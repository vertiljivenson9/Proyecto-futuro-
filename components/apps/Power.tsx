
import React from 'react';

interface PowerProps {
  onPower: (action: 'shutdown' | 'suspend' | 'reboot') => void;
}

const Power: React.FC<PowerProps> = ({ onPower }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-12 bg-black">
      <div className="w-24 h-24 bg-red-600/10 border border-red-500/20 rounded-[3rem] flex items-center justify-center text-5xl mb-12 shadow-2xl">
        ⚡
      </div>
      
      <h2 className="text-white font-black uppercase tracking-[0.5em] mb-12 text-xs italic">Gestión de Energía</h2>

      <div className="grid grid-cols-1 gap-6 w-full max-w-xs">
        <button 
          onClick={() => onPower('suspend')}
          className="group flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all active:scale-95"
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl">🌙</span>
            <span className="text-[10px] font-black uppercase text-white tracking-widest">Suspender</span>
          </div>
          <span className="text-white/20">→</span>
        </button>

        <button 
          onClick={() => onPower('reboot')}
          className="group flex items-center justify-between p-6 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl hover:bg-indigo-600/30 transition-all active:scale-95"
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl">🔄</span>
            <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Reiniciar</span>
          </div>
          <span className="text-indigo-400/20">→</span>
        </button>

        <button 
          onClick={() => onPower('shutdown')}
          className="group flex items-center justify-between p-6 bg-red-600/10 border border-red-500/20 rounded-2xl hover:bg-red-600/30 transition-all active:scale-95"
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl">🛑</span>
            <span className="text-[10px] font-black uppercase text-red-500 tracking-widest">Apagar</span>
          </div>
          <span className="text-red-500/20">→</span>
        </button>
      </div>
    </div>
  );
};

export default Power;
