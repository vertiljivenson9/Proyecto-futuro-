import React, { useState } from 'react';
const Login = ({ onUnlock }) => {
  const [pin, setPin] = useState('');
  const handleKeypad = (num) => pin.length < 4 && setPin(p => p + num);
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center font-mono">
      <div className="w-full max-w-sm glass p-12 rounded-[4.5rem] border border-white/10 text-center animate-in fade-in zoom-in">
        <div className="w-24 h-24 bg-indigo-600 rounded-[2.5rem] mx-auto flex items-center justify-center text-4xl mb-10 text-white">V</div>
        <div className="flex justify-center gap-5 mb-14">
          {[0,1,2,3].map(i => <div key={i} className={`w-4 h-4 rounded-full border-2 ${pin.length > i ? 'bg-indigo-500 border-indigo-500' : 'border-white/20'}`}></div>)}
        </div>
        <div className="grid grid-cols-3 gap-5">
          {[1,2,3,4,5,6,7,8,9].map(n => <button key={n} onClick={() => handleKeypad(String(n))} className="h-16 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center text-2xl font-black text-white hover:bg-white/10 transition-all">{n}</button>)}
          <button onClick={() => setPin('')} className="h-16 rounded-3xl bg-red-600/5 text-red-500 font-black">Del</button>
          <button onClick={() => handleKeypad('0')} className="h-16 rounded-3xl bg-white/5 flex items-center justify-center text-2xl font-black text-white">0</button>
          <button onClick={async () => (await onUnlock(pin)) ? null : setPin('')} className="h-16 rounded-3xl bg-indigo-600/10 text-indigo-400 font-black">Ok</button>
        </div>
      </div>
    </div>
  );
};
export default Login;