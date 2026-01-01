export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.includes('wrangler')) return new Response(null, { status: 404 });
    try {
      const response = await env.ASSETS.fetch(request);
      if (response.status === 404 && !url.pathname.includes('.')) {
        return await env.ASSETS.fetch(new URL('/index.html', url.origin));
      }
      return response;
    } catch (e) {
      return new Response("Kernel_Sync_Error", { status: 500 });
    }
  }
};