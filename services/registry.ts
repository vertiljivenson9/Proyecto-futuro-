const REG_KEY = 'VERTIL_REGISTRY_V3';
export const initRegistry = async () => {
  const initial = { wallpaper: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1974', machine_id: 'V-PRO-X', current_ip: '127.0.0.1', systemInfo: { os: 'VertilOS Sovereign' }, adminPin: '2002' };
  localStorage.setItem(REG_KEY, JSON.stringify(initial));
  return initial;
};
export const getRegistry = async () => JSON.parse(localStorage.getItem(REG_KEY) || '{}');
export const updateRegistry = async (u) => {
  const c = await getRegistry();
  const n = { ...c, ...u };
  localStorage.setItem(REG_KEY, JSON.stringify(n));
  return n;
};