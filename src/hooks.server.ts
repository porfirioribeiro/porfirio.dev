import type { Handle, HandleFetch } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);

  console.log("handle", event.url.toString());

  if (
    event.url.pathname.startsWith("/blog") &&
    event.url.hostname === "porfirio.dev"
  ) {
    response.headers.set("Cache-Control", "public, max-age=5, s-maxage=86400");
  }

  return response;
};

export const handleFetch: HandleFetch = ({ request, fetch }) => {
  console.log("handleFetch", request.url);

  return fetch(request);
};
