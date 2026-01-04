import React, { useState } from 'react';
export default function Login({ onUnlock }) {
  const [pin, setPin] = useState('');
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center p-6 font-mono">
      <div className="w-full max-w-sm glass p-12 rounded-[4rem] border border-white/10 text-center">
        <div className="w-20 h-20 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center text-4xl mb-10 shadow-2xl">V</div>
        <h2 className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-6">CORE_ACCESS_PROTOCOL</h2>
        <input type="password" value={pin} onChange={e => setPin(e.target.value)} className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white text-center text-2xl outline-none focus:border-indigo-500 mb-6" />
        <button onClick={() => onUnlock(pin)} className="w-full py-4 bg-indigo-600 rounded-2xl text-white font-black uppercase text-xs tracking-widest">UNLOCK CORE</button>
      </div>
    </div>
  );
}