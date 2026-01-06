const REG_KEY = 'VERTIL_REGISTRY_V3';
export const initRegistry = async () => {
  const saved = localStorage.getItem(REG_KEY);
  if (saved) return JSON.parse(saved);
  const initial = { wallpaper: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1974', theme: 'dark', machine_id: 'V-' + Date.now(), securityEnabled: false, adminPin: '2002', systemInfo: { os: "VertilOS Sovereign" } };
  localStorage.setItem(REG_KEY, JSON.stringify(initial));
  return initial;
};
export const updateRegistry = async updates => {
  const cur = JSON.parse(localStorage.getItem(REG_KEY));
  const next = { ...cur, ...updates };
  localStorage.setItem(REG_KEY, JSON.stringify(next));
  return next;
};
export const getRegistry = async () => JSON.parse(localStorage.getItem(REG_KEY));