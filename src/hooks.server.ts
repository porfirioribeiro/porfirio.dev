import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit/hooks';

export const handle: Handle = async ({ event, resolve }) => {
  if (event.url.hostname === 'www.porfirio.dev') {
    redirect(301, `https://porfirio.dev${event.url.pathname}${event.url.search}`);
  }

  const response = await resolve(event);

  if (event.url.pathname.startsWith('/blog') && event.url.hostname === 'porfirio.dev') {
    response.headers.set('Cache-Control', 'public, max-age=5, s-maxage=86400');
  }

  return response;
};
