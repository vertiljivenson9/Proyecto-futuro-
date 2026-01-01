import React, { useState, useEffect } from 'react';
import { listDir } from '../../services/fs';
import { Kernel } from '../../services/kernel';

const GerthaStore = () => {
  const [apps, setApps] = useState([]);
  useEffect(() => { listDir('/store').then(res => setApps(res.map(f => JSON.parse(f.content)))); }, []);
  const install = async (app) => { await Kernel.installToDesktop(app.id); alert("Instalado!"); window.location.reload(); };
  return (
    <div className="p-10 bg-black h-full overflow-auto">
      <h1 className="text-3xl font-black mb-10">GERTHA STORE</h1>
      <div className="grid grid-cols-2 gap-6">
        {apps.map(app => (
          <div key={app.id} className="bg-white/5 p-6 rounded-3xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4"><img src={app.icon} className="w-12 h-12" /><div>{app.title}</div></div>
            <button onClick={() => install(app)} className="px-4 py-2 bg-indigo-600 rounded-xl font-bold">INSTALAR</button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default GerthaStore;