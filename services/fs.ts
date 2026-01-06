const DB_NAME = 'VertilFS_v2';
const STORE_NAME = 'inodes';
let db = null;
export const initFS = () => new Promise(resolve => {
  const req = indexedDB.open(DB_NAME, 3);
  req.onupgradeneeded = e => e.target.result.createObjectStore(STORE_NAME, { keyPath: 'path' });
  req.onsuccess = e => { db = e.target.result; resolve(); };
});
export const saveInode = inode => new Promise(resolve => {
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).put(inode);
  tx.oncomplete = () => resolve();
});
export const saveFile = async (path, content, namespace) => {
  await saveInode({ id: crypto.randomUUID(), name: path.split('/').pop(), type: 'file', path, content, size: content.length, created: Date.now(), modified: Date.now(), permissions: 0o644, namespace });
};
export const getInode = path => new Promise(resolve => {
  if(!db) return resolve(null);
  const req = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(path);
  req.onsuccess = () => resolve(req.result);
});
export const listDir = path => new Promise(resolve => {
  const req = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).getAll();
  req.onsuccess = () => resolve(req.result.filter(i => (i.path.substring(0, i.path.lastIndexOf('/')) || '/') === path));
});
export const deleteInode = path => new Promise(resolve => {
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).delete(path);
  tx.oncomplete = () => resolve();
});
export const getFullFS = () => new Promise(resolve => {
  const req = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).getAll();
  req.onsuccess = () => resolve(req.result);
});