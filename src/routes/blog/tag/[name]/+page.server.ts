import { createGH } from "$lib/server/gh";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const gh = createGH(event);
  const name = event.params.name;
  try {
    const [posts, tag] = await Promise.all([
      gh.getAllBlogPosts({ tag: name }),
      gh.getLabelByName(name),
    ]);

    return { posts, tag };
  } catch (e) {
    throw error(404, `Tag ${name} not found`);
  }
};
