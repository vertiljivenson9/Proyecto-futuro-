export const Kernel = {
  checkSecurityStatus: async () => true,
  verifyPin: async (pin) => pin === '2002',
  generateKeyFileContent: async () => "VERIFIED-SOVEREIGN-KEY"
};