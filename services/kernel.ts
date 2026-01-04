import { getInode, listDir } from './fs';
const CORE_SECURITY_KEY = "VERTIL_SYSTEM_CORE_KEY_99";
export const Kernel = {
  exec: async (command, args, currentDir) => {
    if (command === 'ls') { const items = await listDir(currentDir); return { output: items.map(i => i.name).join('\n') }; }
    return { output: 'Command not found.' };
  },
  validateBinary: async (content) => ({ safe: !content.includes("<script") }),
  checkSecurityStatus: async () => true,
  verifyPin: async (pin) => pin === "2002"
};