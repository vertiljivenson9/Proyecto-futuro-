
import React, { useState, useRef, useEffect } from 'react';
import { saveFile, listDir, getInode } from '../../services/fs';

interface IDEProps {
  onOpenWindow?: (id: string, title: string, icon: string, initialPath?: string) => void;
}

const IDE: React.FC<IDEProps> = ({ onOpenWindow }) => {
  const [appName, setAppName] = useState('New Sovereign App');
  const [html, setHtml] = useState('<div class="main">\n  <h1>Hello VertilOS</h1>\n  <button onclick="alert(\'Action Confirmed\')">Execute</button>\n</div>');
  const [js, setJs] = useState('console.log("App initialized.");');
  const [css, setCss] = useState('.main { text-align: center; color: white; padding: 40px; font-family: "JetBrains Mono", monospace; } \n button { background: #4f46e5; border: none; padding: 10px 20px; color: white; border-radius: 8px; cursor: pointer; }');
  const [icon, setIcon] = useState('https://cdn-icons-png.flaticon.com/512/1005/1005141.png');
  const [tab, setTab] = useState<'html' | 'js' | 'css'>('html');
  const [building, setBuilding] = useState(false);
  const [showBuildDialog, setShowBuildDialog] = useState(false);
  const [lastPackage, setLastPackage] = useState<any>(null);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [availableApps, setAvailableApps] = useState<any[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadAppsList = async () => {
    const userApps = await listDir('/user/apps');
    const systemApps = await listDir('/apps');
    const all = [...userApps, ...systemApps].filter(f => f.name.endsWith('.vpx'));
    setAvailableApps(all);
    setShowLoadDialog(true);
  };

  const loadAppSource = async (path: string) => {
    const inode = await getInode(path);
    if (inode && inode.content) {
      try {
        const data = JSON.parse(inode.content);
        setAppName(data.title);
        setIcon(data.icon);
        setHtml(data.code.html);
        setJs(data.code.js);
        setCss(data.code.css);
        setShowLoadDialog(false);
      } catch (e) { alert("ERROR: Corrupted Binary."); }
    }
  };

  const handleBuildTrigger = async () => {
    const appPackage = {
      id: crypto.randomUUID().substring(0, 8),
      title: appName,
      icon: icon,
      namespace: `com.vertil.custom.${appName.toLowerCase().replace(/\s/g, '')}`,
      code: { html, js, css },
      signature: `V-SIGN-${Date.now()}`,
      version: '1.2.0',
      pricing: { isPaid: false, price: '0.00' }
    };
    setLastPackage(appPackage);
    setShowBuildDialog(true);
  };

  const handleInstallToDesktop = async () => {
    if (!lastPackage) return;
    setBuilding(true);
    const pkgStr = JSON.stringify(lastPackage);
    await saveFile(`/user/apps/${lastPackage.id}.vpx`, pkgStr, 'com.vertil.user.apps');
    await saveFile(`/apps/${lastPackage.id}.vpx`, pkgStr, 'com.vertil.apps');
    setTimeout(() => {
      setBuilding(false);
      setShowBuildDialog(false);
      alert("BINARY DEPLOYED: System reload triggered.");
      window.location.reload(); 
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] font-mono text-white overflow-hidden">
      <div className="h-14 bg-black/60 border-b border-white/10 flex items-center px-6 justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={loadAppsList} className="w-8 h-8 bg-indigo-600/20 border border-indigo-500/30 rounded-lg flex items-center justify-center text-xs hover:bg-indigo-600 transition-all">📂</button>
          <input 
            value={appName}
            onChange={e => setAppName(e.target.value)}
            className="bg-transparent border-none outline-none text-[10px] font-black uppercase text-indigo-400 w-48"
          />
        </div>
        <div className="flex gap-3">
          <button onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 border border-white/10 rounded-lg text-[8px] font-black uppercase hover:bg-white/5 transition-all">Set Icon</button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={e => {
            const f = e.target.files?.[0];
            if (f) { const r = new FileReader(); r.onload = (ev) => setIcon(ev.target?.result as string); r.readAsDataURL(f); }
          }} />
          <button 
            onClick={handleBuildTrigger}
            disabled={building}
            className="px-6 py-1.5 bg-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-indigo-500 shadow-xl disabled:opacity-50 transition-all"
          >
            {building ? 'PACKING...' : 'COMPILE VPX'}
          </button>
        </div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
        <div className="flex-grow flex flex-col border-r border-white/5">
          <div className="flex bg-black/40 border-b border-white/5">
            {['html', 'js', 'css'].map((t: any) => (
              <button key={t} onClick={() => setTab(t)} className={`px-10 py-3 text-[9px] font-black uppercase tracking-widest transition-all ${tab === t ? 'bg-indigo-600 text-white' : 'text-white/20 hover:bg-white/5'}`}>.{t}</button>
            ))}
          </div>
          <textarea 
            value={tab === 'html' ? html : tab === 'js' ? js : css}
            onChange={e => tab === 'html' ? setHtml(e.target.value) : tab === 'js' ? setJs(e.target.value) : setCss(e.target.value)}
            className="flex-grow bg-black/40 p-6 outline-none resize-none text-[11px] text-emerald-400 font-bold leading-relaxed custom-scroll"
            spellCheck={false}
          />
        </div>
        <div className="w-full md:w-80 bg-black/60 p-10 flex flex-col items-center">
          <h3 className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] mb-10">Preview node</h3>
          <div className="bg-white/5 rounded-[3rem] p-10 border border-white/10 shadow-2xl flex flex-col items-center gap-8 group hover:border-indigo-500/40 transition-all">
             <div className="w-24 h-24 rounded-[2rem] bg-black/40 p-5 shadow-2xl group-hover:scale-110 transition-transform"><img src={icon} className="w-full h-full object-contain" alt="" /></div>
             <div className="text-xs font-black uppercase text-center tracking-widest text-white/80">{appName}</div>
          </div>
        </div>
      </div>

      {showBuildDialog && (
        <div className="fixed inset-0 z-[30000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="max-w-md w-full glass p-10 rounded-[4rem] border border-indigo-500/40 text-center space-y-8 shadow-2xl">
            <div className="text-6xl">⚛️</div>
            <h2 className="text-xl font-black text-white uppercase tracking-widest">Sovereign Compiler</h2>
            <button 
              onClick={handleInstallToDesktop}
              className="w-full py-5 bg-indigo-600 rounded-3xl text-white font-black uppercase text-[11px] tracking-widest hover:bg-indigo-500 shadow-2xl active:scale-95 transition-all"
            >
              Install Binary to Desktop
            </button>
            <button onClick={() => setShowBuildDialog(false)} className="text-[9px] text-white/20 uppercase font-black hover:text-white">Abort Process</button>
          </div>
        </div>
      )}

      {showLoadDialog && (
        <div className="fixed inset-0 z-[30001] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="max-w-lg w-full glass p-10 rounded-[3rem] border border-white/10 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 border-b border-white/10 pb-4">Import Binary Source</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto custom-scroll pr-2">
              {availableApps.map(app => (
                <button 
                  key={app.path} 
                  onClick={() => loadAppSource(app.path)}
                  className="w-full text-left p-4 bg-white/5 rounded-xl border border-white/5 hover:border-indigo-500 transition-all group flex items-center justify-between"
                >
                  <span className="text-[9px] font-black uppercase text-white/70 group-hover:text-white">{app.name}</span>
                  <span className="text-[8px] text-indigo-500/40 uppercase">Load Source</span>
                </button>
              ))}
              {availableApps.length === 0 && <p className="text-center py-10 text-white/20 uppercase text-[9px]">No custom binaries found</p>}
            </div>
            <button onClick={() => setShowLoadDialog(false)} className="w-full py-4 text-[9px] font-black uppercase text-white/30 hover:text-white transition-all">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IDE;
