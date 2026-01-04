import React from 'react';
import Explorer from './apps/Explorer';
import CloneSys from './apps/CloneSys';
import Settings from './apps/Settings';
export default function AppLauncher({ appId }) {
  switch(appId) {
    case 'explorer': return <Explorer />;
    case 'clonesys': return <CloneSys />;
    case 'settings': return <Settings refreshRegistry={() => window.location.reload()} />;
    default: return <div className="p-10 text-white/20 uppercase text-xs">Target Missing.</div>;
  }
}