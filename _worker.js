export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const res = await env.ASSETS.fetch(request);
    if (res.status === 404 && !url.pathname.includes('.')) {
      return await env.ASSETS.fetch(new URL('/index.html', url.origin));
    }
    return res;
  }
};