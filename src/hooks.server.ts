import type { Handle } from '@sveltejs/kit/hooks';

export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);

  if (event.url.pathname.startsWith('/blog') && event.url.hostname === 'porfirio.dev') {
    response.headers.set('Cache-Control', 'public, max-age=5, s-maxage=86400');
  }

  return response;
};
