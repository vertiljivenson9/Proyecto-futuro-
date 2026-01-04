export enum RunLevel { BOOT, KERNEL, USER }
export interface Inode { path: string; name: string; type: string; content?: string; size: number; }