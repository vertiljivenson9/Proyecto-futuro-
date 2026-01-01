import { Inode } from '../types';
const DB_NAME = 'VertilFS_v2';
const STORE_NAME = 'inodes';
let db: IDBDatabase | null = null;
export const initFS = (): Promise<void> => { /* Logic */ return Promise.resolve(); };