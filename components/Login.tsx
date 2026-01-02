
import React, { useState, useEffect } from 'react';
import { Kernel } from '../services/kernel';

interface LoginProps {
  onUnlock: (pin: string) => Promise<boolean>;
  onFileUnlock: (content: string) => Promise<boolean>;
}

const Login: React.FC<LoginProps> = ({ onUnlock, onFileUnlock }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleKeypad = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setError(false);
    }
  };

  const handleClear = () => {
    setPin('');
    setError(false);
  };

  const executeUnlock = async () => {
    if (pin.length !== 4) return;
    setLoading(true);
    
    // Call Kernel for verification
    const ok = await onUnlock(pin);

    if (ok) {
      window.dispatchEvent(new CustomEvent('system_unlocked'));
    } else {
      setError(true);
      setPin('');
      setAttempts(prev => prev + 1);
      setTimeout(() => setError(false), 800);
    }
    setLoading(false);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const content = ev.target?.result as string;
      const ok = await onFileUnlock(content);
      if (ok) {
        window.dispatchEvent(new CustomEvent('system_unlocked'));
      } else {
        setError(true);
        setTimeout(() => setError(false), 1500);
      }
    };
    reader.readAsText(file);
  };

  // Automatically trigger unlock when 4 digits are reached
  useEffect(() => {
    if (pin.length === 4) {
      const timer = setTimeout(() => executeUnlock(), 300);
      return () => clearTimeout(timer);
    }
  }, [pin]);

  if (attempts >= 5) {
    return (
      <div className="fixed inset-0 z-[100000] bg-black flex flex-col items-center justify-center p-12 text-center font-mono">
        <div className="text-8xl mb-8 animate-pulse text-red-600">⚠️</div>
        <h1 className="text-red-500 font-black text-2xl uppercase tracking-[0.4em] mb-4 italic">Security Lockout</h1>
        <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-12 max-w-sm leading-relaxed">
          The system kernel has detected excessive failed attempts. Access to the sovereign core has been suspended for protection.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-16 py-5 bg-red-600 rounded-3xl text-white font-black uppercase text-[10px] tracking-widest shadow-[0_0_50px_rgba(220,38,38,0.3)] hover:bg-red-500 transition-all active:scale-95"
        >
          Hard Reboot System
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[99999] bg-[#000] flex items-center justify-center p-6 select-none font-mono">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.08)_0%,transparent_80%)]"></div>
      
      {/* Background Animated Lines */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="w-full max-w-sm glass p-12 rounded-[4.5rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative z-10 text-center animate-in fade-in zoom-in duration-700">
        
        <div className={`w-24 h-24 bg-indigo-600 rounded-[2.5rem] mx-auto flex items-center justify-center text-4xl mb-10 transition-all duration-500 shadow-2xl ${error ? 'bg-red-600 scale-110' : 'hover:scale-105 shadow-indigo-500/30'}`}>
          {loading ? (
             <div className="w-8 h-8 border-4 border-t-white border-white/20 rounded-full animate-spin"></div>
          ) : error ? '❌' : 'V'}
        </div>

        <h2 className="text-[10px] text-white/30 uppercase font-black tracking-[0.4em] mb-6 italic">Core Access Protocol</h2>
        
        <div className="flex justify-center gap-5 mb-14 relative">
          {[0, 1, 2, 3].map(i => (
            <div 
              key={i} 
              className={`w-4 h-4 rounded-full border-2 transition-all duration-300 transform ${
                pin.length > i 
                  ? 'bg-indigo-500 border-indigo-500 scale-125 shadow-[0_0_15px_rgba(79,70,229,0.6)]' 
                  : 'border-white/20 scale-100'
              } ${error ? 'bg-red-600 border-red-600 animate-shake' : ''}`}
            ></div>
          ))}
          {error && <div className="absolute -bottom-8 left-0 right-0 text-red-500 text-[8px] font-black uppercase tracking-widest animate-pulse">Incorrect Signature</div>}
        </div>

        <div className="grid grid-cols-3 gap-5 mb-12">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <button 
              key={n} 
              onClick={() => handleKeypad(String(n))} 
              className="h-16 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center text-2xl font-black text-white/90 hover:bg-white/10 hover:border-indigo-500/30 active:scale-90 transition-all shadow-lg"
            >
              {n}
            </button>
          ))}
          <button 
            onClick={handleClear} 
            className="h-16 rounded-3xl bg-red-600/5 border border-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-600/20 active:scale-90 transition-all"
          >
            Del
          </button>
          <button 
            onClick={() => handleKeypad('0')} 
            className="h-16 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center text-2xl font-black text-white/90 hover:bg-white/10 hover:border-indigo-500/30 active:scale-90 transition-all"
          >
            0
          </button>
          <button 
            onClick={executeUnlock} 
            className="h-16 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600/30 active:scale-90 transition-all"
          >
            Ok
          </button>
        </div>

        <div className="pt-8 border-t border-white/5">
          <label className="flex items-center justify-center gap-4 p-5 bg-white/5 rounded-3xl border border-dashed border-white/10 cursor-pointer hover:bg-indigo-600/10 hover:border-indigo-500/30 transition-all group active:scale-95">
            <span className="text-xl group-hover:animate-bounce transition-transform">🛡️</span>
            <div className="text-left">
              <span className="block text-[8px] text-white/60 font-black uppercase tracking-widest">Sovereign Key</span>
              <span className="block text-[7px] text-white/20 uppercase font-bold">Import .vtl signature</span>
            </div>
            <input type="file" accept=".vtl" onChange={handleFile} className="hidden" />
          </label>
        </div>

        <div className="mt-8 text-[7px] text-white/10 uppercase tracking-[0.4em]">
          VertilOS Kernel Security v4.5 | {attempts} Active Faults
        </div>
      </div>
    </div>
  );
};

export default Login;
