import { getBlogPostById } from "$lib/server/gh";
import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const post = await getBlogPostById(+params.id);

  if (!post) throw error(404, "Not Found");

  if (params.slug !== post.slug) throw redirect(301, post.link);

  return { post };
};