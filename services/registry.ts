export const initRegistry = async () => {
  const initial = { wallpaper: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1974', machine_id: 'V-PRO-X', current_ip: '127.0.0.1', systemInfo: { os: 'VertilOS Sovereign' } };
  localStorage.setItem('VERTIL_REGISTRY_V3', JSON.stringify(initial));
  return initial;
};
export const getRegistry = async () => JSON.parse(localStorage.getItem('VERTIL_REGISTRY_V3') || '{}');