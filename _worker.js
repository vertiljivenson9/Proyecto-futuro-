export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) return new Response(JSON.stringify({ status: "OK" }));
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