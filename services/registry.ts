export const initRegistry = async () => {
  const res = await fetch('https://api.ipify.org?format=json').catch(() => ({json: () => ({ip: '127.0.0.1'})}));
  const data = await res.json();
  const initial = { wallpaper: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1974', current_ip: data.ip };
  localStorage.setItem('VERTIL_REG_V3', JSON.stringify(initial)); return initial;
};
export const getRegistry = async () => JSON.parse(localStorage.getItem('VERTIL_REG_V3') || '{}');
export const updateRegistry = async (u) => { const c = await getRegistry(); const n = {...c, ...u}; localStorage.setItem('VERTIL_REG_V3', JSON.stringify(n)); return n; };