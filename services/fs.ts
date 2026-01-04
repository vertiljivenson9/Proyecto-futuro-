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
    request.onerror = () => reject(new Error('FS_DENIED'));
  });
};
export const getInode = (path: string): Promise<Inode | null> => {
  return new Promise((resolve) => {
    if (!db) return resolve(null);
    const trans = db.transaction(STORE_NAME, 'readonly');
    const store = trans.objectStore(STORE_NAME);
    const req = store.get(path);
    req.onsuccess = () => resolve(req.result || null);
  });
};
export const saveFile = async (path: string, content: string, namespace: string) => {
  if (!db) return;
  const trans = db.transaction(STORE_NAME, 'readwrite');
  const store = trans.objectStore(STORE_NAME);
  store.put({ id: crypto.randomUUID(), name: path.split('/').pop(), type: 'file', path, content, size: content.length, created: Date.now(), modified: Date.now(), permissions: 0o644, namespace });
};
export const listDir = async (path: string): Promise<Inode[]> => {
  return new Promise((resolve) => {
    if (!db) return resolve([]);
    const trans = db.transaction(STORE_NAME, 'readonly');
    const store = trans.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => {
      const all = req.result as Inode[];
      resolve(all.filter(i => {
        const parent = i.path.substring(0, i.path.lastIndexOf('/')) || '/';
        return parent === path && i.path !== path;
      }));
    };
  });
};
export const deleteInode = (path: string): Promise<void> => {
  return new Promise((resolve) => {
    if (!db) return resolve();
    const trans = db.transaction(STORE_NAME, 'readwrite');
    const store = trans.objectStore(STORE_NAME);
    const req = store.delete(path);
    req.onsuccess = () => resolve();
  });
};
export const getFullFS = (): Promise<Inode[]> => {
  return new Promise((resolve) => {
    if (!db) return resolve([]);
    const trans = db.transaction(STORE_NAME, 'readonly');
    const store = trans.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
  });
};