import { getInode } from './fs';
export const Kernel = {
  exec: async (cmd) => ({ output: 'Command not found.' }),
  checkSecurityStatus: async () => { const lock = await getInode('/system/lock/vertilock.vtl'); return !!(lock || localStorage.getItem("desktopLockKey")); },
  verifyPin: async (pin) => pin === "2002",
  verifyKeyFile: async (content) => content.includes("VERTILOCK-V1-SIG")
};