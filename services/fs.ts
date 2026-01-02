
import { Inode } from '../types';

const DB_NAME = 'VertilFS_v2';
const STORE_NAME = 'inodes';

let db: IDBDatabase | null = null;

export const initFS = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 3);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'path' });
      }
    };

    request.onsuccess = async (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      await ensureBaseStructure();
      resolve();
    };

    request.onerror = () => reject(new Error('FATAL: Filesystem access denied.'));
  });
};

const ensureBaseStructure = async () => {
  const rootDirs = [
    { path: '/bin', ns: 'com.vertil.system' },
    { path: '/user', ns: 'com.vertil.user' },
    { path: '/user/apps', ns: 'com.vertil.user.apps' },
    { path: '/user/documents', ns: 'com.vertil.user.docs' },
    { path: '/system', ns: 'com.vertil.kernel' },
    { path: '/system/wallpapers', ns: 'com.vertil.kernel.assets' },
    { path: '/system/lock', ns: 'com.vertil.kernel.security' },
    { path: '/system/vendor', ns: 'com.vertil.kernel.vendor' },
    { path: '/apps', ns: 'com.vertil.apps' },
    { path: '/store', ns: 'com.vertil.store' },
    { path: '/var/log', ns: 'com.vertil.logs' }
  ];

  for (const dir of rootDirs) {
    const exists = await getInode(dir.path);
    if (!exists) {
      await saveInode({
        id: crypto.randomUUID(),
        name: dir.path.split('/').pop() || '',
        type: 'directory',
        path: dir.path,
        size: 0,
        created: Date.now(),
        modified: Date.now(),
        permissions: 0o755,
        namespace: dir.ns
      });
    }
  }

  // Wallpapers por defecto
  const defaults = [
    { name: 'wp1.jpg', url: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1974' },
    { name: 'wp2.jpg', url: 'https://images.unsplash.com/photo-1511300636408-a63a89df3482?q=80&w=2070' },
    { name: 'wp3.jpg', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070' },
    { name: 'wp4.jpg', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070' }
  ];

  for (const wp of defaults) {
    const path = `/system/wallpapers/${wp.name}`;
    const exists = await getInode(path);
    if (!exists) {
      await saveFile(path, wp.url, 'com.vertil.kernel.assets');
    }
  }

  const wallpaper = await getInode('/user/wallpaper.img');
  if (!wallpaper) {
    await saveFile('/user/wallpaper.img', defaults[0].url, 'com.vertil.user');
  }
};

export const getInode = (path: string): Promise<Inode | null> => {
  return new Promise((resolve) => {
    if (!db) return resolve(null);
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(path);
    request.onsuccess = () => resolve(request.result || null);
  });
};

export const saveInode = (inode: Inode): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('FS_NOT_INIT');
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(inode);
    request.onsuccess = () => resolve();
    request.onerror = () => reject('IO_WRITE_ERROR');
  });
};

export const deleteInode = (path: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('FS_NOT_INIT');
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(path);
    request.onsuccess = () => resolve();
    request.onerror = () => reject('IO_DELETE_ERROR');
  });
};

export const saveFile = async (path: string, content: string, namespace: string) => {
  const parts = path.split('/');
  const name = parts[parts.length - 1];
  await saveInode({
    id: crypto.randomUUID(),
    name,
    type: 'file',
    path,
    content,
    size: content.length,
    created: Date.now(),
    modified: Date.now(),
    permissions: 0o644,
    namespace
  });
};

export const listDir = async (path: string): Promise<Inode[]> => {
  return new Promise((resolve) => {
    if (!db) return resolve([]);
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => {
      const all = request.result as Inode[];
      resolve(all.filter(i => {
        const parent = i.path.substring(0, i.path.lastIndexOf('/')) || '/';
        return parent === path && i.path !== path;
      }));
    };
  });
};

export const getFullFS = (): Promise<Inode[]> => {
  return new Promise((resolve) => {
    if (!db) return resolve([]);
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result as Inode[]);
  });
};
