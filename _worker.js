export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      let res = await env.ASSETS.fetch(request);
      if (res.ok && (url.pathname.endsWith('.js') || url.pathname === '/bundle.js')) {
        const content = await res.blob();
        const headers = new Headers(res.headers);
        headers.set('Content-Type', 'application/javascript');
        return new Response(content, { headers });
      }
      if (res.status === 404 && !url.pathname.includes('.')) {
        return await env.ASSETS.fetch(new URL('/index.html', url.origin));
      }
      return res;
    } catch (e) { return new Response("Error", { status: 500 }); }
  }
};