const REG_KEY = 'VERTIL_REGISTRY_V3';
export const initRegistry = async () => {
  const saved = localStorage.getItem(REG_KEY);
  if (saved) return JSON.parse(saved);
  const initial = {
    wallpaper: '/user/wallpaper.img', theme: 'dark', machine_id: 'V-' + crypto.randomUUID().substring(0,8).toUpperCase(),
    current_ip: '127.0.0.1', securityEnabled: false, adminPin: '2002'
  };
  localStorage.setItem(REG_KEY, JSON.stringify(initial));
  return initial;
};
export const updateRegistry = async (updates: any) => {
  const current = await getRegistry();
  const next = { ...current, ...updates };
  localStorage.setItem(REG_KEY, JSON.stringify(next));
  return next;
};
export const getRegistry = async () => {
  const saved = localStorage.getItem(REG_KEY);
  return saved ? JSON.parse(saved) : null;
};