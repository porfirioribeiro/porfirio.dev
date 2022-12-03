export const prerender = true;

import { books } from "$lib/resources/books";
import { podcasts } from "$lib/resources/podcasts";
import { courses } from "$lib/resources/courses";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => {
  return {
    books,
    podcasts,
    courses,
  };
};
