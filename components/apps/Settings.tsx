import React, { useState, useEffect, useCallback } from 'react';
import { updateRegistry, getRegistry } from '../../services/registry';
import { saveFile, listDir, deleteInode } from '../../services/fs';

const Settings = ({ refreshRegistry }) => {
  const [reg, setReg] = useState(null);
  const [securityEnabled, setSecurityEnabled] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [installedApps, setInstalledApps] = useState([]);

  const load = useCallback(async () => {
    const r = await getRegistry();
    setReg(r); setSecurityEnabled(r.securityEnabled); setNewPin(r.adminPin);
    const apps = await listDir('/apps');
    setInstalledApps(apps.filter(f => f.name.endsWith('.vpx')).map(f => ({ ...JSON.parse(f.content), path: f.path })));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    await updateRegistry({ securityEnabled, adminPin: String(newPin) });
    refreshRegistry();
    alert("KERNEL: Seguridad actualizada.");
  };

  const handleUninstall = async (app) => {
    if (confirm("¿Eliminar " + app.title + "?")) {
      await deleteInode(app.path);
      window.location.reload();
    }
  };

  if (!reg) return null;
  return (
    <div className="p-8 font-mono text-xs space-y-8 bg-black h-full overflow-auto">
      <section className="space-y-4">
        <h2 className="text-indigo-500 font-black uppercase">Seguridad</h2>
        <div className="bg-white/5 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <span>PIN de acceso</span>
            <input type="password" value={newPin} onChange={e => setNewPin(e.target.value)} className="bg-black border border-white/10 p-2 rounded text-center w-32" />
          </div>
          <button onClick={handleSave} className="w-full py-3 bg-indigo-600 rounded-xl font-black">GUARDAR</button>
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-indigo-500 font-black uppercase">Apps Instaladas</h2>
        {installedApps.map(app => (
          <div key={app.id} className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
            <span>{app.title}</span>
            <button onClick={() => handleUninstall(app)} className="text-red-500 font-bold uppercase">Desinstalar</button>
          </div>
        ))}
      </section>
    </div>
  );
};
export default Settings;