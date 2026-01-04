import { listDir, getInode } from './fs';
const CORE_SECURITY_KEY = "VERTIL_SYSTEM_CORE_KEY_99";
export const Kernel = {
  exec: async (cmd, args) => ({ output: "Command Executed" }),
  checkSecurityStatus: async () => true,
  verifyPin: async (pin) => pin === "2002",
  verifyKeyFile: async (c) => true
};