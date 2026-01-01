export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      let response = await env.ASSETS.fetch(request);
      if (url.pathname.endsWith('.js') || url.pathname === '/bundle.js') {
        const content = await response.blob();
        return new Response(content, {
          status: response.status,
          headers: {
            ...Object.fromEntries(response.headers),
            'Content-Type': 'application/javascript; charset=utf-8'
          }
        });
      }
      if (response.status === 404 && !url.pathname.includes('.')) {
        return await env.ASSETS.fetch(new URL('/index.html', url.origin));
      }
      return response;
    } catch (e) {
      return new Response("VERTIL_KERNEL_PANIC: " + e.message, { status: 500 });
    }
  }
};