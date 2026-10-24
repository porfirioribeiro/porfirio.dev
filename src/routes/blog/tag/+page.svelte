<script lang="ts">
  import Seo from '#lib/components/Seo.svelte';
  import { getBlogPosts } from '#lib/blog.remote.js';
  import {
    breadcrumbSchema,
    collectionPageSchema,
    personSchema,
    websiteSchema,
  } from '#lib/seo.js';
  import type { BlogTag } from '#lib/types/blog.js';

  const description = 'Browse every topic covered in the porfirio.dev blog by Porfírio Ribeiro.';

  const posts = getBlogPosts();
  const postList = $derived(await posts);

  const tags = $derived.by(() => {
    const unique: Record<string, BlogTag> = {};
    for (const post of postList) {
      for (const tag of post.tags) {
        if (tag.name) unique[tag.name] = tag;
      }
    }
    return Object.values(unique).sort((a, b) => a.name.localeCompare(b.name));
  });

  const breadcrumb = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: 'Tags', path: '/blog/tag' },
  ];
</script>

<Seo
  title="Blog Tags — Porfírio Ribeiro"
  {description}
  jsonLd={[
    websiteSchema(description),
    personSchema(),
    collectionPageSchema({ name: 'Blog tags', description, path: '/blog/tag', breadcrumb }),
    breadcrumbSchema(breadcrumb),
  ]}
/>

<h1>Tags</h1>

<p>Browse the topics covered in the blog, or go back to <a href="/blog">all posts</a>.</p>

<ul class="tags">
  {#each tags as tag (tag.name)}
    <li>
      <h2>
        <a href={tag.link}>
          <span class="dot" style:background={tag.color} aria-hidden="true"></span>{tag.name}
        </a>
      </h2>
      {#if tag.description}
        <p>{tag.description}</p>
      {/if}
    </li>
  {/each}
</ul>

{#if tags.length === 0}
  <p>No tags yet — there are no published posts at the moment.</p>
{/if}

<style lang="scss">
  .tags {
    padding: 0;
    margin: 1rem 0;
    list-style: none;
  }

  li {
    margin-bottom: 1rem;
  }

  h2 {
    margin: 0;
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;

    a {
      display: inline-flex;
      align-items: center;
      color: var(--theme-on-background);
    }
  }

  p {
    margin: 0.25rem 0 0;
    color: var(--theme-muted);
    font-size: 0.9rem;
  }

  .dot {
    display: inline-block;
    width: 0.8em;
    height: 0.8em;
    margin-right: 0.5em;
    border-radius: 50%;
  }
</style>
