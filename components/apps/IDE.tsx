import React, { useState } from 'react';
import { saveFile } from '../../services/fs';
import { Kernel } from '../../services/kernel';

const IDE = ({ onOpenWindow }) => {
  const [html, setHtml] = useState('<h1>Hola Mundo</h1>');
  const [appName, setAppName] = useState('Nueva App');

  const build = async () => {
    const app = { id: Date.now().toString(), title: appName, namespace: 'com.custom.app', code: { html, js: '', css: '' }, icon: 'https://cdn-icons-png.flaticon.com/512/1005/1005141.png' };
    await saveFile(`/apps/${app.id}.vpx`, JSON.stringify(app), 'com.vertil.apps');
    alert("BUILD COMPLETADO");
    window.location.reload();
  };

  return (
    <div className="h-full flex flex-col bg-black text-white p-6">
      <input value={appName} onChange={e => setAppName(e.target.value)} className="bg-transparent border-b border-white/10 mb-4 p-2" />
      <textarea value={html} onChange={e => setHtml(e.target.value)} className="flex-grow bg-white/5 p-4 font-mono text-emerald-400 outline-none rounded" />
      <button onClick={build} className="mt-4 py-4 bg-indigo-600 font-black rounded-xl">PUBLICAR .VPX</button>
    </div>
  );
};
export default IDE;