import { getAllBlogPosts, getLabelByName } from "$lib/server/gh";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params: { name } }) => {
  try {
    const [posts, tag] = await Promise.all([
      getAllBlogPosts({ tag: name }),
      getLabelByName(name),
    ]);

    return { posts, tag };
  } catch (e) {
    throw error(404, `Tag ${name} not found`);
  }
};
