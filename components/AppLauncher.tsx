import React from 'react';
import VertiJEdge from './apps/VertiJEdge';
import Explorer from './apps/Explorer';
import CloneSys from './apps/CloneSys';
const AppLauncher = ({ appId }) => {
  switch(appId) {
    case 'vertijedge': return <VertiJEdge />;
    case 'explorer': return <Explorer />;
    case 'clonesys': return <CloneSys />;
    default: return <div className="p-10 text-white/20 uppercase text-xs">Target Binary Not Found: {appId}</div>;
  }
};
export default AppLauncher;