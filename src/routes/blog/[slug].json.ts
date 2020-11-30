const posts = [];

const lookup = new Map();
posts.forEach((post) => {
  lookup.set(post.slug, JSON.stringify(post));
});

export function get(req) {
  console.log(req);

  const { slug } = req.params;

  if (lookup.has(slug)) {
    return { headers: {}, body: lookup.get(slug) };
  } else {
    return {
      headers: {},
      status: 404,
      body: {
        message: `Not found`,
      },
    };
  }
}
