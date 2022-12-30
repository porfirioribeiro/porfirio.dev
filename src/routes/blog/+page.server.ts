import { createGH } from "$lib/server/gh";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  return { posts: createGH(event).getAllBlogPosts() };
};
