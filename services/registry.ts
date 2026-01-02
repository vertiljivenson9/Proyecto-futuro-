const REG_KEY = 'VERTIL_REGISTRY_V3';

const getRealIP = async () => {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    return data.ip;
  } catch {
    return '127.0.0.1';
  }
};

const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "Tablet Sovereign";
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return "Mobile Terminal";
  }
  return "Desktop Station";
};

const generateMID = (ip: string) => {
  const hardware = [
    navigator.userAgent.length,
    screen.width,
    screen.height,
    navigator.hardwareConcurrency || 4
  ].join('-');
  return 'V-' + btoa(ip + '-' + hardware).substring(0, 14).toUpperCase();
};

export const initRegistry = async () => {
  const saved = localStorage.getItem(REG_KEY);
  const realIP = await getRealIP();
  const device = getDeviceType();
  
  const systemInfo = {
    os: "VertilOS Sovereign",
    version: "3.5.2-ULTIMATE",
    kernel: "Sovereign-L0",
    resolution: `${screen.width}x${screen.height}`,
    cpu: `${navigator.hardwareConcurrency || 4} Cores Atomic`,
    browser: navigator.userAgent.split(' ')[0],
    device: device
  };

  if (saved) {
    const parsed = JSON.parse(saved);
    return { ...parsed, current_ip: realIP, systemInfo };
  }

  const initial = {
    wallpaper: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1974',
    theme: 'dark',
    machine_id: generateMID(realIP),
    current_ip: realIP,
    virtual_mac: Array.from({length: 6}, () => Math.floor(Math.random()*256).toString(16).padStart(2, '0')).join(':'),
    drivers: {
      'net': 'active',
      'tor-bridge': 'active',
      'firewall': 'active',
      'watchdog': 'active'
    },
    lastBoot: Date.now(),
    securityEnabled: false,
    adminPin: '2002',
    systemInfo
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