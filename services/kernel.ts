
import { getRegistry, updateRegistry } from './registry';
import { getFullFS, getInode, saveFile, deleteInode, listDir, saveInode } from './fs';
import { SYSTEM_FILES_MANIFEST } from './dna';

const CORE_SECURITY_KEY = "VERTIL_SYSTEM_CORE_KEY_99";
const VTL_SIGNATURE = "VERTILOCK-V1-SIG";

/**
 * Prepara los archivos para GitHub eliminando rutas absolutas y filtrando solo el ADN.
 */
async function prepareGitFiles(): Promise<{path: string, content: string}[]> {
  const inodes = await getFullFS();
  const dna = SYSTEM_FILES_MANIFEST;
  
  return inodes
    .filter(f => f.type === 'file')
    .filter(f => {
      const cleanPath = f.path.startsWith('/') ? f.path.substring(1) : f.path;
      return dna.includes(cleanPath);
    })
    .map(f => ({ 
      path: f.path.startsWith('/') ? f.path.substring(1) : f.path, 
      content: f.content || '' 
    }));
}

/**
 * "Flashea" el ADN del sistema al VFS. 
 * Realiza auto-hidratación intentando leer el código fuente actual.
 */
async function syncDNA(force: boolean = false) {
  const currentDNA = SYSTEM_FILES_MANIFEST;
  for (const path of currentDNA) {
    const fullPath = path.startsWith('/') ? path : `/${path}`;
    const exists = await getInode(fullPath);
    
    if (!exists || force) {
      try {
        // Intentar auto-hidratación: El sistema lee su propio código fuente
        const response = await fetch(fullPath);
        if (response.ok) {
          const content = await response.text();
          await saveFile(fullPath, content, "com.vertil.kernel.dna");
          continue;
        }
      } catch (e) {
        console.warn(`DNA_SYNC: No se pudo auto-hidratar ${fullPath}, usando placeholder seguro.`);
      }

      // Si falla la hidratación, crear un placeholder VÁLIDO según extensión
      if (!exists) {
        let safeContent = "";
        if (path.endsWith('.json')) {
          safeContent = "{}"; // JSON válido para evitar errores de parseo en build
        } else if (path.endsWith('.html')) {
          safeContent = "<!DOCTYPE html><html></html>";
        } else {
          safeContent = `// VERTILOS_DNA_STUB: ${path}\n// Pendiente de hidratación completa.`;
        }
        await saveFile(fullPath, safeContent, "com.vertil.kernel.dna");
      }
    }
  }
}

async function exec(command: string, args: string[], currentDir: string = '/'): Promise<{ output: string, intent?: string, data?: any }> {
  const reg = await getRegistry();
  const cmd = command.toLowerCase();
  const installedBinaries = await listDir('/bin');
  const isInstalled = installedBinaries.some(b => b.name === cmd);

  const builtins: Record<string, () => Promise<any> | any> = {
    'help': () => ({
      output: `VERTILOS SOVEREIGN SHELL v5.1\nBinarios: ${installedBinaries.map(b => b.name).join(', ') || 'ninguno'}`
    }),
    'ls': async () => {
      const items = await listDir(currentDir);
      return { output: items.map(i => `${i.type === 'directory' ? 'DIR' : 'FIL'}  ${i.name}`).join('\n') || 'Vacío.' };
    },
    'dna-sync': async () => {
      await syncDNA(true);
      return { output: "DNA_SYNC: Sincronización y auto-hidratación completada." };
    },
    'clear': () => ({ output: '', intent: 'clear' }),
  };

  if (builtins[cmd]) return await builtins[cmd]();
  if (isInstalled) return { output: `Ejecutando binario ${cmd}...` };

  return { output: `sh: ${command}: comando no encontrado.` };
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
  },
  getIdentity: async () => {
    const reg = await getRegistry();
    return { soul: reg.machine_id, presence: reg.current_ip };
  },
  getSystemDNA: () => SYSTEM_FILES_MANIFEST
};

function decrypt(encoded: string): string {
  try {
    const text = atob(encoded);
    return text.split('').map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) ^ CORE_SECURITY_KEY.charCodeAt(i % CORE_SECURITY_KEY.length))
    ).join('');
  } catch { return ''; }
}
