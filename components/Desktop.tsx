import React from 'react';
export default function Desktop({ windows, onOpenWindow }) {
  return <div className="h-full w-full bg-[#050505] p-10">
    <button onClick={() => onOpenWindow('clonesys', 'CloneSys', '')} className="p-4 bg-indigo-600 rounded-xl text-white font-bold">REPLICATOR</button>
  </div>;
}