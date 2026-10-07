import { error, redirect } from '@sveltejs/kit';
import { getRequestEvent, query } from '$app/server';

import { createGH } from '#lib/server/gh/index.js';

function gh() {
  return createGH(getRequestEvent());
}

export const getBlogPosts = query(async () => {
  return gh().getAllBlogPosts();
});

export const getBlogTags = query(async () => {
  return gh().getAllTags();
});

export const getBlogPostsByTag = query('unchecked', async (name: string) => {
  try {
    const ghClient = gh();
    const [posts, tag] = await Promise.all([
      ghClient.getAllBlogPosts({ tag: name }),
      ghClient.getLabelByName(name),
    ]);

    return { posts, tag };
  } catch {
    error(404, `Tag ${name} not found`);
  }
});

export const getBlogPost = query(
  'unchecked',
  async ({ id, slug }: { id: number; slug: string }) => {
    const ghClient = gh();
    const post = await ghClient.getBlogPostById(id);

    if (!post) error(404, 'Not Found');

    if (slug !== post.slug) redirect(301, post.link);

    const comments = await ghClient.getCommentsForBlogPost(post.number);

    comments.forEach((c) => Object.assign(post.blocks, c.blocks));

    return { post, comments };
  },
);
