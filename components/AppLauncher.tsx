import React from 'react';
import CloneSys from './apps/CloneSys';
import Explorer from './apps/Explorer';
export default function AppLauncher({ appId, onOpenWindow, onClose }) {
  switch(appId) {
    case 'clonesys': return <CloneSys />;
    case 'explorer': return <Explorer onOpenFile={onOpenWindow} />;
    default: return <div className="p-10 text-white/20 italic text-xs uppercase">Binary Not Found: {appId}</div>;
  }
}