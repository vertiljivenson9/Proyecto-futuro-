export const initRegistry = async () => {
  let ip = '127.0.0.1';
  try { const res = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(2000) }); const data = await res.json(); ip = data.ip; } catch (e) {}
  const initial = { wallpaper: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1974', current_ip: ip };
  localStorage.setItem('VERTIL_REG_V3', JSON.stringify(initial));
  return initial;
};
export const getRegistry = async () => JSON.parse(localStorage.getItem('VERTIL_REG_V3') || '{}');