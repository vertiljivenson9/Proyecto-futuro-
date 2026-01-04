import React, { useState } from 'react';
export default function Login({ onUnlock }) {
  const [pin, setPin] = useState('');
  return <div className="h-full bg-black flex flex-col items-center justify-center p-10">
    <h1 className="text-white text-xl mb-6">CORE_ACCESS_REQUIRED</h1>
    <input type="password" value={pin} onChange={e => setPin(e.target.value)} className="bg-white/10 p-4 rounded text-white mb-4" />
    <button onClick={() => onUnlock(pin)} className="bg-indigo-600 p-4 rounded text-white">UNLOCK</button>
  </div>;
}