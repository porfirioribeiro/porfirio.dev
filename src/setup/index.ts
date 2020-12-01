export function prepare(headers) {
  // this function runs before every page/endpoint request
  return {
    context: {}, // this object is passed to endpoints, and used to derive session
    headers: {}, // this object is mixed in with response headers
  };
}

export function getSession(context) {
  return {
    user: context.user && {
      name: context.user.name,
    },
  };
}
