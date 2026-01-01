export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/bundle.js') {
      const res = await env.ASSETS.fetch(request);
      return new Response(res.body, { headers: { ...Object.fromEntries(res.headers), 'Content-Type': 'application/javascript' } });
    }
    const res = await env.ASSETS.fetch(request);
    if (res.status === 404 && !url.pathname.includes('.')) {
      return await env.ASSETS.fetch(new URL('/index.html', url.origin));
    }
    return res;
  }
};