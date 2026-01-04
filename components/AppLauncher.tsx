import React from 'react';
import Explorer from './apps/Explorer';
import CloneSys from './apps/CloneSys';
import PowerShell from './apps/PowerShell';
export default function AppLauncher({ appId, onOpenWindow, onClose }) {
  switch(appId) {
    case 'explorer': return <Explorer onOpenFile={onOpenWindow} />;
    case 'clonesys': return <CloneSys />;
    case 'powershell': return <PowerShell onClose={onClose} />;
    default: return <div className="p-10 text-white/20 italic text-xs uppercase">Binary Not Found: {appId}</div>;
  }
}