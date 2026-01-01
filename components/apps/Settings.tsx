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
    setInstalledApps(apps.filter(f => f.name.endsWith('.vpx')).map(f => {
      try { return { ...JSON.parse(f.content), path: f.path }; } catch { return null; }
    }).filter(x => x !== null));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    await updateRegistry({ securityEnabled, adminPin: String(newPin) });
    refreshRegistry();
    alert("KERNEL: Seguridad actualizada.");
  };

  const handleUninstall = async (app) => {
    if (confirm("¿DESINSTALAR " + app.title + "?")) {
      await deleteInode(app.path);
      alert("APP ELIMINADA. Reiniciando núcleo...");
      window.location.reload();
    }
  };

  if (!reg) return null;
  return (
    <div className="p-8 font-mono text-xs space-y-8 bg-black h-full overflow-auto text-white">
      <section className="space-y-4">
        <h2 className="text-indigo-500 font-black uppercase tracking-widest border-b border-white/10 pb-2">Seguridad</h2>
        <div className="bg-white/5 p-6 rounded-2xl space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-white/60">Bloqueo de Arranque</span>
            <button onClick={() => setSecurityEnabled(!securityEnabled)} className={`w-12 h-6 rounded-full p-1 transition-all flex ${securityEnabled ? 'bg-indigo-600 justify-end' : 'bg-white/10 justify-start'}`}>
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </button>
          </div>
          <div className="space-y-2">
            <label className="text-white/20 uppercase text-[8px] font-black">PIN Administrador</label>
            <input type="password" value={newPin} onChange={e => setNewPin(e.target.value)} className="w-full bg-black border border-white/10 p-4 rounded-xl text-center text-xl tracking-[0.5em] outline-none focus:border-indigo-500" />
          </div>
          <button onClick={handleSave} className="w-full py-4 bg-indigo-600 rounded-xl font-black uppercase text-[10px]">GUARDAR CONFIGURACIÓN</button>
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-indigo-500 font-black uppercase tracking-widest border-b border-white/10 pb-2">Gestión de Apps</h2>
        <div className="space-y-2">
          {installedApps.length === 0 ? <div className="p-10 border border-dashed border-white/10 rounded-2xl text-center text-white/20 uppercase text-[9px]">Sin aplicaciones externas</div> : installedApps.map(app => (
            <div key={app.id} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <img src={app.icon} className="w-8 h-8 rounded-lg" />
                <span className="font-bold">{app.title}</span>
              </div>
              <button onClick={() => handleUninstall(app)} className="text-red-500 font-black uppercase text-[10px] hover:text-red-400">Eliminar</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
export default Settings;