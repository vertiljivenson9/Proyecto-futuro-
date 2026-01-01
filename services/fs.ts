import { Inode } from '../types';
const DB_NAME = 'VertilFS_v2';
const STORE_NAME = 'inodes';
let db: IDBDatabase | null = null;
export const initFS = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 3);
    request.onupgradeneeded = (e) => {
      const db = (e.target as any).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: 'path' });
    };
    request.onsuccess = (e) => { db = (e.target as any).result; resolve(); };
    request.onerror = () => reject();
  });
};
export const getInode = (path: string): Promise<Inode | null> => {
  return new Promise((res) => {
    if (!db) return res(null);
    const req = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(path);
    req.onsuccess = () => res(req.result || null);
  });
};
export const saveFile = async (path: string, content: string, namespace: string) => {
  const inode: Inode = { id: crypto.randomUUID(), name: path.split('/').pop() || '', type: 'file', path, content, size: content.length, created: Date.now(), modified: Date.now(), permissions: 0o644, namespace };
  const tx = db!.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).put(inode);
};
export const getFullFS = (): Promise<Inode[]> => {
  return new Promise((res) => {
    const req = db!.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).getAll();
    req.onsuccess = () => res(req.result);
  });
};