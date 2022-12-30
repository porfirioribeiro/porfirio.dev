import { createGH } from "$lib/server/gh";
import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const post = await createGH(event).getBlogPostById(+event.params.id);

  if (!post) throw error(404, "Not Found");

  if (event.params.slug !== post.slug) throw redirect(301, post.link);

  return { post };
};
