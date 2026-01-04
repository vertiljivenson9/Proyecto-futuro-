const DB_NAME = 'VertilFS_v2'; const STORE_NAME = 'inodes'; let db = null;
export const initFS = () => new Promise((resolve) => {
  const req = indexedDB.open(DB_NAME, 3);
  req.onupgradeneeded = (e) => { const db = e.target.result; if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: 'path' }); };
  req.onsuccess = (e) => { db = e.target.result; resolve(); };
});
export const getInode = (path) => new Promise((resolve) => {
  if (!db) return resolve(null);
  const req = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(path);
  req.onsuccess = () => resolve(req.result || null);
});
export const listDir = (path) => new Promise((resolve) => {
  if (!db) return resolve([]);
  const req = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).getAll();
  req.onsuccess = () => resolve(req.result.filter(i => (i.path.substring(0, i.path.lastIndexOf('/')) || '/') === path));
});
export const saveFile = async (path, content, namespace) => {
  if (!db) return;
  db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).put({ id: crypto.randomUUID(), name: path.split('/').pop(), type: 'file', path, content, size: content.length, created: Date.now(), modified: Date.now(), permissions: 0o644, namespace });
};