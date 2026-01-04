import React from 'react';
import Explorer from './apps/Explorer';
import CloneSys from './apps/CloneSys';
import PowerShell from './apps/PowerShell';
export default function AppLauncher({ appId }) {
  switch(appId) {
    case 'explorer': return <Explorer />;
    case 'clonesys': return <CloneSys />;
    case 'powershell': return <PowerShell />;
    default: return <div className="p-10 text-white/20 uppercase text-xs">Binary {appId} not found.</div>;
  }
}