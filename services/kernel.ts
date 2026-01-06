import { getRegistry } from './registry';
const VTL_SIGNATURE = "VERTILOCK-V1-SIG";
export const Kernel = {
  checkSecurityStatus: async () => (await getRegistry())?.securityEnabled === true,
  verifyPin: async (pin: string) => (await getRegistry())?.adminPin === pin,
  verifyKeyFile: async (content: string) => content.includes(VTL_SIGNATURE),
  generateKeyFileContent: async () => {
    const reg = await getRegistry();
    return `SIGNATURE: ${VTL_SIGNATURE}\nNODE: ${reg?.machine_id}\nVERIFIED`;
  }
};