
export enum RunLevel {
  BOOT = 0,
  KERNEL = 1,
  DRIVERS = 2,
  USER = 3,
  HALT = 4
}

export interface Inode {
  id: string;
  name: string;
  type: 'file' | 'directory' | 'app' | 'link';
  path: string;
  content?: string;
  size: number;
  created: number;
  modified: number;
  permissions: number;
  icon?: string;
  namespace: string; // com.vertil.*
  checksum?: string;
}

export interface WindowState {
  id: string;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  appId: string;
  x: number;
  y: number;
  width: number | string;
  height: number | string;
  initialPath?: string; // Ruta del archivo a abrir al iniciar la app
}

export interface SystemRegistry {
  wallpaper: string;
  theme: string;
  drivers: Record<string, 'active' | 'error' | 'recovering'>;
  lastBoot: number;
  owner: string;
  activeNamespace: string;
  installedApps: string[];
}
