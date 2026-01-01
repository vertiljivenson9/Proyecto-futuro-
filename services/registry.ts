const REG_KEY = 'VERTIL_REGISTRY_V3';
export const getRegistry = async () => { const saved = localStorage.getItem(REG_KEY); return saved ? JSON.parse(saved) : null; };