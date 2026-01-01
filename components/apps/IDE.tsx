import React, { useState } from 'react';
import { saveFile } from '../../services/fs';
import { Kernel } from '../../services/kernel';

const IDE = () => {
  const [code, setCode] = useState('// Escribe tu app aquí');
  const handleBuild = async () => {
    const app = { id: Date.now().toString(), title: 'App Custom', code: { html: code, js: '', css: '' }, icon: 'https://cdn-icons-png.flaticon.com/512/1005/1005141.png' };
    await saveFile(`/apps/${app.id}.vpx`, JSON.stringify(app), 'com.vertil.apps');
    alert("BUILD COMPLETED");
    window.location.reload();
  };
  return (
    <div className="h-full flex flex-col bg-black p-4">
      <textarea value={code} onChange={e => setCode(e.target.value)} className="flex-grow bg-white/5 p-4 text-emerald-400 font-mono outline-none rounded-xl" />
      <button onClick={handleBuild} className="mt-4 py-4 bg-indigo-600 rounded-xl font-black">BUILD .VPX</button>
    </div>
  );
};
export default IDE;