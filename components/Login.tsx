import React, { useState } from 'react';
export default function Login({ onUnlock }) {
  const [pin, setPin] = useState('');
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center p-6 font-mono text-center">
      <div className="w-full max-w-sm glass p-12 rounded-[4rem] border border-white/10 shadow-2xl">
        <div className="w-20 h-20 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center text-4xl mb-10 font-bold">V</div>
        <input type="password" value={pin} onChange={e => setPin(e.target.value)} className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white text-center text-2xl outline-none mb-6" />
        <button onClick={() => onUnlock(pin)} className="w-full py-4 bg-indigo-600 rounded-2xl text-white font-black uppercase text-xs tracking-widest">Unlock Core</button>
      </div>
    </div>
  );
}