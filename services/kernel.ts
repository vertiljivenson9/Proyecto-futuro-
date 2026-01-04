import { getInode, listDir } from './fs';
export const Kernel = {
  exec: async (cmd, args, currentDir = '/') => {
    if (cmd === 'ls') { const items = await listDir(currentDir); return { output: items.map(i => i.name).join('\n') }; }
    return { output: 'sh: command not found' };
  },
  checkSecurityStatus: async () => { const lock = await getInode('/system/lock/vertilock.vtl'); return !!(lock || localStorage.getItem("desktopLockKey")); },
  verifyPin: async (pin) => pin === "2002",
  verifyKeyFile: async (content) => content.includes("VERTILOCK-V1-SIG")
};