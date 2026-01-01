import { Inode } from '../types';
const DB_NAME = 'VertilFS_v2';
const STORE_NAME = 'inodes';
let db: IDBDatabase | null = null;
export const initFS = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 3);
    request.onupgradeneeded = (e) => { const db = (e.target as any).result; if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: 'path' }); };
    request.onsuccess = (e) => { db = (e.target as any).result; resolve(); };
    request.onerror = () => reject(new Error('FS_DENIED'));
  });
};
export const getInode = (path: string): Promise<Inode | null> => {
  return new Promise(r => { if(!db) return r(null); const s = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME); const req = s.get(path); req.onsuccess = () => r(req.result || null); });
};
export const saveInode = (inode: Inode): Promise<void> => {
  return new Promise((r, j) => { if(!db) return j('NO_DB'); const s = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME); const req = s.put(inode); req.onsuccess = () => r(); });
};
export const deleteInode = (path: string): Promise<void> => {
  return new Promise((r, j) => { if(!db) return j('NO_DB'); const s = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME); const req = s.delete(path); req.onsuccess = () => r(); });
};
export const saveFile = async (path: string, content: string, namespace: string) => {
  await saveInode({ id: crypto.randomUUID(), name: path.split('/').pop() || '', type: 'file', path, content, size: content.length, created: Date.now(), modified: Date.now(), permissions: 0o644, namespace });
};
export const listDir = async (path: string): Promise<Inode[]> => {
  return new Promise(r => { if(!db) return r([]); const s = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME); const req = s.getAll(); req.onsuccess = () => { const all = req.result as Inode[]; r(all.filter(i => { const p = i.path.substring(0, i.path.lastIndexOf('/')) || '/'; return p === path && i.path !== path; })); }; });
};
export const getFullFS = (): Promise<Inode[]> => {
  return new Promise(r => { if(!db) return r([]); const s = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME); const req = s.getAll(); req.onsuccess = () => r(req.result as Inode[]); });
};