import type { Handle, HandleFetch } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);

  response.headers.set("Cache-Control", "max-age=10, s-maxage=60");

  console.log(
    "handle",
    event.url.pathname,
    Object.fromEntries(response.headers.entries())
  );

  return response;
};

export const handleFetch: HandleFetch = ({ request, fetch }) => {
  console.log("handleFetch", request.url);

  return fetch(request);
};
