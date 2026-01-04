import { getInode, listDir } from './fs';
export const Kernel = {
  exec: async (cmd: string, args: string[], currentDir: string = '/') => {
    if (cmd === 'ls') { const items = await listDir(currentDir); return { output: items.map(i => i.name).join('\n') }; }
    return { output: 'Command not found.' };
  },
  checkSecurityStatus: async () => {
    const lock = await getInode('/system/lock/vertilock.vtl');
    return !!(lock || localStorage.getItem("desktopLockKey"));
  },
  verifyPin: async (pin: string) => pin === "2002",
  verifyKeyFile: async (content: string) => content.includes("VERTILOCK-V1-SIG")
};