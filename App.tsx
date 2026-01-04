import React, { useState, useEffect } from 'react';
import Desktop from './components/Desktop';
import { initFS } from './services/fs';
import { initRegistry } from './services/registry';
export default function App() {
  const [boot, setBoot] = useState(false);
  const [reg, setReg] = useState(null);
  const [win, setWin] = useState([]);
  useEffect(() => {
    const start = async () => {
      await initFS();
      const r = await initRegistry();
      setReg(r);
      setBoot(true);
      if(document.getElementById('system-loader')) document.getElementById('system-loader').style.display='none';
    };
    start();
  }, []);
  if(!boot) return null;
  return <Desktop registry={reg} windows={win} setWindows={setWin} onOpenWindow={(id,t,ic) => setWin(p=>[...p,{id:crypto.randomUUID(),appId:id,title:t,icon:ic,x:50,y:50,width:900,height:600,zIndex:100,isMinimized:false,isMaximized:false}])} />;
}