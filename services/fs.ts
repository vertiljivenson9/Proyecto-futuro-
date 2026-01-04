import { Inode } from '../types';
const DB_NAME = 'VertilFS_v2'; const STORE_NAME = 'inodes'; let db = null;
const WPS = ["https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1974", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964", "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070", "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072"];
export const initFS = () => new Promise((resolve) => {
  const req = indexedDB.open(DB_NAME, 3);
  req.onupgradeneeded = (e) => { const db = e.target.result; if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: 'path' }); };
  req.onsuccess = async (e) => { db = e.target.result; 
    for(let i=0; i<WPS.length; i++) { const p = "/system/wallpapers/wp_"+i+".txt"; 
    const tx = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME);
    tx.put({id: crypto.randomUUID(), name: "wp_"+i, type: "file", path: p, content: WPS[i], size: WPS[i].length});
    }
    resolve(); 
  };
  req.onerror = () => resolve();
});
export const listDir = (path) => new Promise((resolve) => {
  if (!db) return resolve([]);
  const req = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).getAll();
  req.onsuccess = () => resolve(req.result.filter(i => (i.path.substring(0, i.path.lastIndexOf('/')) || '/') === path));
});
export const saveFile = async (p, c, ns) => {
  if (!db) return;
  const tx = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME);
  tx.put({ id: crypto.randomUUID(), name: p.split('/').pop(), type: 'file', path: p, content: c, size: c.length });
};