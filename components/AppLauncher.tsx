import React from 'react';
import Explorer from './apps/Explorer';
import Settings from './apps/Settings';
import CloneSys from './apps/CloneSys';
export default function AppLauncher({ appId }) {
  if(appId==='explorer') return <Explorer />;
  if(appId==='settings') return <Settings refreshRegistry={()=>window.location.reload()} />;
  if(appId==='clonesys') return <CloneSys />;
  return <div className="p-10 text-white/20 uppercase text-xs">Binary Missing.</div>;
}