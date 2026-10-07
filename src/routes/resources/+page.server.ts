export const prerender = true;

import { books } from '#lib/resources/books.js';
import { podcasts } from '#lib/resources/podcasts.js';
import { courses } from '#lib/resources/courses.js';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
  return {
    books,
    podcasts,
    courses,
  };
};
