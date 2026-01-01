const REG_KEY = 'VERTIL_REGISTRY_V3';
export const getRegistry = async () => { const saved = localStorage.getItem(REG_KEY); return saved ? JSON.parse(saved) : null; };
export const updateRegistry = async (updates: any) => { const current = await getRegistry(); const next = { ...current, ...updates }; localStorage.setItem(REG_KEY, JSON.stringify(next)); return next; };