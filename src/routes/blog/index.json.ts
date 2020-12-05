import { getPosts } from "./_utils"

export async function get(req) {
  const posts = await getPosts();

  return { headers: {}, body: posts };
}
