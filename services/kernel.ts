import { listDir } from './fs';
import { getRegistry } from './registry';
const CORE_SECURITY_KEY = "VERTIL_SYSTEM_CORE_KEY_99";
const VTL_SIGNATURE = "VERTILOCK-V1-SIG";
export const Kernel = {
  exec: async (command, args, currentDir = '/') => {
    const cmd = command.toLowerCase();
    if (cmd === 'ls') { const items = await listDir(currentDir); return { output: items.map(i => `${i.type === 'directory' ? '📁' : '📄'} ${i.name}`).join('\n') || 'Empty.' }; }
    if (cmd === 'clear') return { intent: 'clear', output: '' };
    if (cmd === 'nano') return { intent: 'open_nano', data: args[0] || '', output: '' };
    return { output: `sh: ${command}: command not found.` };
  },
  checkSecurityStatus: async () => (await getRegistry())?.securityEnabled === true,
  verifyPin: async (pin) => String(pin) === String((await getRegistry())?.adminPin || "2002"),
  verifyKeyFile: async (content) => content.includes(VTL_SIGNATURE),
  generateKeyFileContent: async () => {
    const reg = await getRegistry();
    return `SIGNATURE: ${VTL_SIGNATURE}\nNODE: ${reg?.machine_id}\n::PAYLOAD::\nVERIFIED`;
  }
};