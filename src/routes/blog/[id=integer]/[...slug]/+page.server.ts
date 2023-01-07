import { createGH } from "$lib/server/gh";
import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const gh = createGH(event);
  const post = await gh.getBlogPostById(+event.params.id);

  if (!post) throw error(404, "Not Found");

  if (event.params.slug !== post.slug) throw redirect(301, post.link);

  const comments = await gh.getCommentsForBlogPost(post.number);

  comments.forEach((c) => Object.assign(post.blocks, c.blocks));

  return { post, comments };
};
