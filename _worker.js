export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      let res = await env.ASSETS.fetch(request);
      if (res.status === 404 && !url.pathname.includes('.')) {
        res = await env.ASSETS.fetch(new URL('/index.html', url.origin));
      }
      if (url.pathname.endsWith('.tsx')) {
        const content = await res.blob();
        return new Response(content, { headers: { ...Object.fromEntries(res.headers), 'Content-Type': 'application/javascript' } });
      }
      return res;
    } catch (e) { return new Response("Error", { status: 500 }); }
  }
};