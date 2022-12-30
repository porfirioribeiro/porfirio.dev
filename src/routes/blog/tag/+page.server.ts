import { getAllTags } from "$lib/server/gh";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const tags = await getAllTags();

  return { tags };
};