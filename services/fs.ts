import { Inode } from '../types';
const DB_NAME = 'VertilFS_v2';
const STORE_NAME = 'inodes';
let db: IDBDatabase | null = null;
export const initFS = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 3);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: 'path' });
    };
    request.onsuccess = async (event) => { db = (event.target as IDBOpenDBRequest).result; resolve(); };
    request.onerror = () => reject(new Error('FATAL: Filesystem access denied.'));
  });
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
    id: crypto.randomUUID(), name, type: 'file', path, content, size: content.length,
    created: Date.now(), modified: Date.now(), permissions: 0o644, namespace
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