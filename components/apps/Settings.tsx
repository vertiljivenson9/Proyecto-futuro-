
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { updateRegistry, getRegistry } from '../../services/registry';
import { saveFile, getInode, listDir, deleteInode } from '../../services/fs';
import { Inode } from '../../types';
import { Kernel } from '../../services/kernel';

interface SettingsProps {
  refreshRegistry: () => void;
}

const Settings: React.FC<SettingsProps> = ({ refreshRegistry }) => {
  const [reg, setReg] = useState<any>(null);
  const [wallpapers, setWallpapers] = useState<Inode[]>([]);
  const [pin, setPin] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [installedApps, setInstalledApps] = useState<Inode[]>([]);
  
  // Verification States
  const [showSecurityLockout, setShowSecurityLockout] = useState(false);
  const [isVerifyingManual, setIsVerifyingManual] = useState(false);
  const [verifyPin, setVerifyPin] = useState('');
  const [verifyError, setVerifyError] = useState(false);
  const [rebooting, setRebooting] = useState(false);

  const decrypt = (encoded: string) => {
    const key = "VERTIL_SYSTEM_CORE_KEY_99";
    try {
      const text = atob(encoded);
      return text.split('').map((char, i) => 
        String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
      ).join('');
    } catch { return ''; }
  };

  const encrypt = (text: string) => {
    const key = "VERTIL_SYSTEM_CORE_KEY_99";
    return btoa(text.split('').map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
    ).join(''));
  };

  const loadData = useCallback(async () => {
    const current = await getRegistry();
    if (current) setReg(current);
    const wps = await listDir('/system/wallpapers');
    setWallpapers(wps);
    const savedPin = localStorage.getItem("desktopLockKey");
    if (savedPin) setPin(decrypt(savedPin));
    const apps = await listDir('/user/apps');
    setInstalledApps(apps);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSaveLock = async () => {
    const code = pin;
    if (code.length !== 4) return alert("Code must be 4 digits.");
    setIsSaving(true);
    try {
      const encrypted = encrypt(code);
      localStorage.setItem("desktopLockKey", encrypted);
      const header = "VERTILOCK-V1-SIG";
      await saveFile('/system/lock/vertilock.vtl', `${header}|${encrypted}`, 'com.vertil.kernel.security');
      await updateRegistry({ securityEnabled: true, adminPin: code });
      refreshRegistry();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) { console.error(e); } finally { setIsSaving(false); }
  };

  const handleExportKey = () => {
    const code = pin;
    if (code.length !== 4) return alert("Primero debes establecer un PIN de 4 dígitos.");
    
    const encrypted = encrypt(code);
    const header = "VERTILOCK-V1-SIG";
    const fileContent = `${header}|${encrypted}`;
    
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Sovereign_Access_Key.vtl';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const setWallpaper = async (url: string) => {
    await updateRegistry({ wallpaper: url });
    refreshRegistry();
    const current = await getRegistry();
    setReg(current);
  };

  const triggerSecurityRestart = () => {
    setRebooting(true);
    setTimeout(() => {
      setRebooting(false);
      setShowSecurityLockout(true);
    }, 1200);
  };

  const handleManualVerify = async () => {
    const ok = await Kernel.verifyPin(verifyPin);
    if (ok) setShowSecurityLockout(false);
    else { setVerifyError(true); setVerifyPin(''); setTimeout(() => setVerifyError(false), 1000); }
  };

  if (!reg) return null;

  return (
    <div className="p-8 font-mono text-xs space-y-12 bg-black text-white h-full overflow-y-auto custom-scroll pb-24 relative">
      
      {/* WALLPAPER SELECTION */}
      <section className="space-y-6">
        <h2 className="text-indigo-400 font-black uppercase tracking-[0.4em] border-l-4 border-indigo-600 pl-4 italic">Desktop appearance</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {wallpapers.map((wp, i) => (
            <button 
              key={i} 
              onClick={() => wp.content && setWallpaper(wp.content)}
              className={`group relative aspect-video rounded-2xl overflow-hidden border-2 transition-all ${reg.wallpaper === wp.content ? 'border-indigo-500 scale-95 shadow-[0_0_20px_rgba(79,70,229,0.4)]' : 'border-white/10 hover:border-white/30'}`}
            >
              <img src={wp.content} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
              {reg.wallpaper === wp.content && (
                <div className="absolute inset-0 bg-indigo-600/20 flex items-center justify-center">
                  <span className="bg-indigo-600 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase">Active</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* MANAGE APPS */}
      <section className="space-y-6">
        <h2 className="text-emerald-400 font-black uppercase tracking-[0.4em] border-l-4 border-emerald-600 pl-4 italic">Manage Binaries</h2>
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-3">
          {installedApps.map(app => (
            <div key={app.id} className="flex items-center justify-between bg-black/40 p-5 rounded-2xl border border-white/5 group hover:border-emerald-500/30 transition-all">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/80">{app.name}</span>
              <button onClick={async () => { await deleteInode(app.path); loadData(); }} className="px-6 py-2 bg-red-600/10 text-red-500 border border-red-500/20 rounded-xl text-[8px] font-black uppercase hover:bg-red-600 hover:text-white transition-all">Uninstall</button>
            </div>
          ))}
        </div>
      </section>

      {/* SECURITY CORE */}
      <section className="space-y-6">
        <h2 className="text-red-400 font-black uppercase tracking-[0.4em] border-l-4 border-red-600 pl-4 italic">Security Core</h2>
        <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 space-y-8 max-w-xl shadow-2xl">
          <div className="space-y-2">
            <label className="text-[8px] text-white/20 uppercase font-black ml-4">Access Signature (PIN)</label>
            <input 
              id="lock-code"
              type="password"
              maxLength={4}
              value={pin}
              onChange={e => setPin(e.target.value.replace(/\D/g, '').substring(0, 4))}
              className="w-full bg-black border border-white/10 p-5 rounded-3xl text-white text-center text-4xl font-black tracking-[0.5em] outline-none focus:border-red-600 transition-all"
              placeholder="0000"
            />
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={handleSaveLock}
                className={`py-5 rounded-2xl transition-all font-black uppercase text-[10px] tracking-widest shadow-xl ${saveSuccess ? 'bg-emerald-600' : 'bg-red-600 hover:bg-red-500'} text-white active:scale-95`}
              >
                {isSaving ? 'Encrypting...' : saveSuccess ? 'Key Saved ✓' : 'Save Master Key'}
              </button>
              <button 
                onClick={triggerSecurityRestart}
                className="py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest transition-all active:scale-95"
              >
                Restart Verification
              </button>
            </div>
            
            <button 
              onClick={handleExportKey}
              className="w-full py-5 bg-white/5 border border-dashed border-white/20 hover:border-indigo-500 hover:bg-indigo-600/10 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <span className="text-lg">🛡️</span> EXPORT SOVEREIGN KEY (.VTL)
            </button>
          </div>
          <p className="text-[7px] text-white/30 uppercase text-center tracking-widest leading-loose px-4">
            Guarda el archivo .vtl en un almacenamiento externo. Te permitirá desbloquear el Kernel incluso si olvidas tu PIN.
          </p>
        </div>
      </section>

      {rebooting && (
        <div className="fixed inset-0 z-[200000] bg-black flex flex-col items-center justify-center animate-in fade-in duration-300">
           <div className="text-[10px] text-red-500 font-black tracking-[0.8em] animate-pulse uppercase mb-4 italic">Kernel Reset</div>
           <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden"><div className="absolute inset-0 bg-red-600 animate-[progress_1.2s_infinite]"></div></div>
        </div>
      )}

      {showSecurityLockout && (
        <div className="fixed inset-0 z-[200001] bg-black flex items-center justify-center p-6 font-mono select-none overflow-hidden">
          <div className="w-full max-w-sm glass p-10 rounded-[3.5rem] border border-white/10 shadow-2xl relative z-10 text-center animate-in zoom-in duration-500">
            <h2 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-10 italic">Verification required</h2>
            {isVerifyingManual ? (
              <div className="space-y-8">
                 <div className="flex justify-center gap-3">
                    {[0,1,2,3].map(i => <div key={i} className={`w-3 h-3 rounded-full border-2 ${verifyPin.length > i ? 'bg-red-500 border-red-500' : 'border-white/20'}`}></div>)}
                 </div>
                 <div className="grid grid-cols-3 gap-3">
                   {[1,2,3,4,5,6,7,8,9].map(n => <button key={n} onClick={() => verifyPin.length < 4 && setVerifyPin(v => v + n)} className="h-14 rounded-2xl bg-white/5 text-xl font-black">{n}</button>)}
                   <button onClick={() => setVerifyPin('')} className="h-14 rounded-2xl bg-white/5 text-[8px] font-black">DEL</button>
                   <button onClick={() => setVerifyPin(v => v + '0')} className="h-14 rounded-2xl bg-white/5 text-xl font-black">0</button>
                   <button onClick={handleManualVerify} className="h-14 rounded-2xl bg-red-600 text-white text-[8px] font-black">OK</button>
                 </div>
              </div>
            ) : (
              <button onClick={() => setIsVerifyingManual(true)} className="w-full py-6 bg-white/10 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest">Enter access code</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
