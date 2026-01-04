import React from 'react';
import Explorer from './apps/Explorer';
import CloneSys from './apps/CloneSys';
export default function AppLauncher({ appId, onOpenWindow, onClose }) {
  switch(appId) {
    case 'explorer': return <Explorer onOpenFile={onOpenWindow} />;
    case 'clonesys': return <CloneSys />;
    default: return <div className="p-10 text-white/20 italic text-xs uppercase">Target Binary Not Found: {appId}</div>;
  }
}