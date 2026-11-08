import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const url = context.url;
  const host = context.request.headers.get('host') || url.host;
  const proto = context.request.headers.get('x-forwarded-proto') || url.protocol.replace(':', '');

  // 1. Force non-www redirect (e.g. www.y7duth.online -> y7duth.online)
  const isWww = host.startsWith('www.');

  // 2. Force HTTPS redirect if accessed via HTTP in production
  const isHttp = proto === 'http' && !host.includes('localhost') && !host.includes('127.0.0.1');

  if (isWww || isHttp) {
    const cleanHost = host.replace(/^www\./i, '');
    const targetUrl = `https://${cleanHost}${url.pathname}${url.search}`;
    return context.redirect(targetUrl, 301);
  }

  return next();
});
