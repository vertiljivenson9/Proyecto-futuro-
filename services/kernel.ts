
import { getRegistry, updateRegistry } from './registry';
import { getFullFS, getInode, saveFile, deleteInode, listDir, saveInode } from './fs';
import { SYSTEM_FILES_MANIFEST } from './dna';

const CORE_SECURITY_KEY = "VERTIL_SYSTEM_CORE_KEY_99";
const VTL_SIGNATURE = "VERTILOCK-V1-SIG";

/**
 * Prepara los archivos para la replicación atómica.
 * No usa placeholders; intenta capturar el código real del entorno.
 */
async function prepareGitFiles(): Promise<{path: string, content: string}[]> {
  const inodes = await getFullFS();
  const dna = SYSTEM_FILES_MANIFEST;
  
  const filesToCommit = [];
  for (const path of dna) {
    const fullPath = path.startsWith('/') ? path : `/${path}`;
    const inode = await getInode(fullPath);
    
    let content = "";
    if (inode && inode.content && !inode.content.startsWith('// VERTILOS_DNA_STUB')) {
      content = inode.content;
    } else {
      // Intentar succión de código fuente real si el VFS no lo tiene
      try {
        const res = await fetch(fullPath);
        if (res.ok) content = await res.text();
      } catch {
        content = path.endsWith('.json') ? "{}" : `// VertilOS: Error de succión para ${path}`;
      }
    }
    
    filesToCommit.push({
      path: path.startsWith('/') ? path.substring(1) : path,
      content: content
    });
  }
  return filesToCommit;
}

async function syncDNA(force: boolean = false) {
  const currentDNA = SYSTEM_FILES_MANIFEST;
  for (const path of currentDNA) {
    const fullPath = path.startsWith('/') ? path : `/${path}`;
    const exists = await getInode(fullPath);
    
    if (!exists || force) {
      try {
        const response = await fetch(fullPath);
        if (response.ok) {
          const content = await response.text();
          await saveFile(fullPath, content, "com.vertil.kernel.dna");
        }
      } catch (e) {
        if (!exists) {
          const safeContent = path.endsWith('.json') ? "{}" : `// DNA_STUB: ${path}`;
          await saveFile(fullPath, safeContent, "com.vertil.kernel.dna");
        }
      }
    }
  }
}

async function exec(command: string, args: string[], currentDir: string = '/'): Promise<{ output: string, intent?: string, data?: any }> {
  const cmd = command.toLowerCase();
  
  const builtins: Record<string, () => Promise<any> | any> = {
    'ls': async () => {
      const items = await listDir(currentDir);
      return { output: items.map(i => `${i.type === 'directory' ? 'DIR' : 'FIL'}  ${i.name}`).join('\n') || 'Vacío.' };
    },
    'dna-sync': async () => {
      await syncDNA(true);
      return { output: "DNA_SYNC: Nucleo hidratado correctamente." };
    },
    'help': () => ({ output: "Comandos: ls, cd, clear, dna-sync, help" }),
    'clear': () => ({ output: '', intent: 'clear' }),
  };

  if (builtins[cmd]) return await builtins[cmd]();
  return { output: `sh: ${command}: no se encuentra el binario.` };
}

export const Kernel = {
  exec,
  prepareGitFiles,
  syncDNA,
  checkSecurityStatus: async () => !!(await getInode('/system/lock/vertilock.vtl') || localStorage.getItem("desktopLockKey")),
  verifyPin: async (pin: string) => pin === "2002",
  verifyKeyFile: async (content: string) => {
    try {
      const [sig, encrypted] = content.split('|');
      if (sig !== VTL_SIGNATURE) return false;
      const pin = decrypt(encrypted);
      return pin === "2002";
    } catch { return false; }
  }
};

function decrypt(encoded: string): string {
  try {
    const text = atob(encoded);
    return text.split('').map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) ^ CORE_SECURITY_KEY.charCodeAt(i % CORE_SECURITY_KEY.length))
    ).join('');
  } catch { return ''; }
}
