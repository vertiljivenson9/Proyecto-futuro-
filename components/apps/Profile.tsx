
import React from 'react';

const Profile: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6">
      <div className="w-32 h-32 rounded-full border-4 border-indigo-500 p-1">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-600 to-purple-800 flex items-center justify-center text-5xl font-black text-white">
          V
        </div>
      </div>
      
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-widest">Vertil Jivenson</h1>
        <p className="text-indigo-400 font-mono text-[10px] uppercase mt-1">Sovereign Administrator | Level 0</p>
      </div>

      <div className="w-full max-w-xs space-y-2">
        <div className="flex justify-between p-3 glass rounded-xl text-[9px] uppercase font-bold">
          <span className="text-white/40">Status</span>
          <span className="text-green-500">Online</span>
        </div>
        <div className="flex justify-between p-3 glass rounded-xl text-[9px] uppercase font-bold">
          <span className="text-white/40">Reputation</span>
          <span className="text-indigo-400">999+ VP</span>
        </div>
        <div className="flex justify-between p-3 glass rounded-xl text-[9px] uppercase font-bold">
          <span className="text-white/40">ID Signature</span>
          <span className="text-white/60 truncate ml-4">0x77E...RTV</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
