import type { Handle, HandleFetch } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);

  response.headers.set("Cache-Control", "public, max-age=30, s-maxage=86400");

  console.log("handle", event.url.pathname);

  return response;
};

export const handleFetch: HandleFetch = ({ request, fetch }) => {
  console.log("handleFetch", request.url);

  return fetch(request);
};
