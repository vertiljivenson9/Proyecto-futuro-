import { getRegistry } from './registry';
export const Kernel = {
  checkSecurityStatus: async () => (await getRegistry())?.securityEnabled === true,
  verifyPin: async (pin: string) => (await getRegistry())?.adminPin === pin,
  verifyKeyFile: async (content: string) => content.includes("VERTILOCK-V1-SIG")
};