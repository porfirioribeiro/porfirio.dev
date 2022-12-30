import { getAllBlogPosts } from "$lib/server/gh";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const posts = await getAllBlogPosts();

  return { posts };
};
