
import React, { useState, useEffect } from 'react';
import Explorer from './apps/Explorer';
import CloneSys from './apps/CloneSys';
import Reggedit from './apps/Reggedit';
import TextEditor from './apps/TextEditor';
import Settings from './apps/Settings';
import PowerShell from './apps/PowerShell';
import MediaPlayer from './apps/MediaPlayer';
import IDE from './apps/IDE';
import GerthaStore from './apps/GerthaStore';
import About from './apps/About';
import Profile from './apps/Profile';
import Vault from './apps/Vault';
import Replicator from './apps/Replicator';
import GoogleSearch from './apps/GoogleSearch';
import NetworkMonitor from './apps/NetworkMonitor';
import TorBrowser from './apps/TorBrowser';
import DevPortal from './apps/DevPortal';
import MovieCenter from './apps/MovieCenter';
import InstructionManual from './apps/InstructionManual';
import KernelDocumentation from './apps/KernelDocumentation';
import { getInode } from '../services/fs';

interface AppLauncherProps {
  appId: string;
  isAdmin: boolean;
  refreshRegistry: () => void;
  initialPath?: string;
  onOpenWindow: (appId: string, title: string, icon: string, initialPath?: string) => void;
  onPower: (action: 'shutdown' | 'suspend' | 'reboot') => void;
  onClose: () => void;
}

const AppLauncher: React.FC<AppLauncherProps> = ({ appId, isAdmin, refreshRegistry, initialPath, onOpenWindow, onPower, onClose }) => {
  const [vpxContent, setVpxContent] = useState<any>(null);

  useEffect(() => {
    if (appId.startsWith('vpx_')) {
      const realId = appId.replace('vpx_', '');
      getInode(`/apps/${realId}.vpx`).then(inode => {
        if (inode?.content) setVpxContent(JSON.parse(inode.content));
      });
    }
  }, [appId]);

  if (appId.startsWith('vpx_')) {
    if (!vpxContent) return <div className="p-10 text-indigo-500 animate-pulse font-mono text-xs uppercase">Resolving Inode Extension...</div>;
    const combinedDoc = `<!DOCTYPE html><html><head><style>body, html { margin: 0; padding: 0; background: #000; color: white; font-family: sans-serif; }${vpxContent.code.css}</style></head><body>${vpxContent.code.html}<script>${vpxContent.code.js}</script></body></html>`;
    return <iframe srcDoc={combinedDoc} className="w-full h-full border-none" title={vpxContent.title} sandbox="allow-scripts" />;
  }

  switch (appId) {
    case 'docs': return <KernelDocumentation />;
    case 'manual': return <InstructionManual initialPath={initialPath} />;
    case 'explorer': return <Explorer refreshRegistry={refreshRegistry} onOpenFile={onOpenWindow} />;
    case 'movies': 
    case 'vertiflix': return <MovieCenter />;
    case 'clonesys': return <CloneSys />;
    case 'replicator': return <Replicator />;
    case 'reggedit': 
    case 'regeditprocess': return <Reggedit />;
    case 'texteditor': return <TextEditor initialPath={initialPath} />;
    case 'settings': return <Settings refreshRegistry={refreshRegistry} />;
    case 'powershell': return <PowerShell onClose={onClose} />;
    case 'mediaplayer': 
    case 'videoport': return <MediaPlayer initialPath={initialPath} />;
    case 'ide': return <IDE onOpenWindow={onOpenWindow} />;
    case 'gerthastore': return <GerthaStore />;
    case 'googlesearch': return <GoogleSearch />;
    case 'torbrowser': return <TorBrowser />;
    case 'netmonitor': return <NetworkMonitor />;
    case 'devportal': return <DevPortal />;
    case 'about': return <About />;
    case 'profile': return <Profile />;
    case 'vault': return <Vault />;
    default:
      return <div className="p-10 text-white/20 italic text-xs font-mono uppercase">Target Binary Not Found: {appId}</div>;
  }
};

export default AppLauncher;
