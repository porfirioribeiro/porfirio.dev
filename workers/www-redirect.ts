const CANONICAL_ORIGIN = 'https://porfirio.dev';

/**
 * Dedicated host-redirect Worker for www.porfirio.dev.
 *
 * Cloudflare Redirect Rules need zone write access, which the deployment token
 * does not have. This Worker is attached to the `www` route instead and issues
 * the same permanent redirect before any asset or page is served, so every
 * `www` URL — including prerendered pages — goes to the canonical apex host.
 */
export default {
  fetch(request: Request): Response {
    const url = new URL(request.url);

    return new Response(null, {
      status: 301,
      headers: {
        location: `${CANONICAL_ORIGIN}${url.pathname}${url.search}`,
        'cache-control': 'public, max-age=86400',
      },
    });
  },
};
