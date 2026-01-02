export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Solo manejamos activos locales de VertilOS.
    // No se permite ninguna capa de red intermedia para evitar bloqueos por seguridad del host (Regla 7).
    const res = await env.ASSETS.fetch(request);
    
    // SPA Routing: Soporte para rutas de navegación internas de VertilOS.
    if (res.status === 404 && !url.pathname.includes('.')) {
      return await env.ASSETS.fetch(new URL('/index.html', url.origin));
    }
    
    return res;
  }
};