import { createGH } from '#lib/server/gh/index.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  return { posts: await createGH(event).getAllBlogPosts() };
};
