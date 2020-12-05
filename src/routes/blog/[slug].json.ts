import { getPost } from "./_utils"

export async function get(req) {
  const { slug } = req.params;

  const post = await getPost(slug);

  if (post) {
    return { headers: {}, body: post };
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
