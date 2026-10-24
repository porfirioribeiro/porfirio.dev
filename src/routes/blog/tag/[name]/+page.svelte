<script lang="ts">
  import ArticleList from '#lib/components/ArticleList.svelte';
  import Seo from '#lib/components/Seo.svelte';
  import { getBlogPostsByTag } from '#lib/blog.remote.js';
  import {
    breadcrumbSchema,
    collectionPageSchema,
    personSchema,
    websiteSchema,
  } from '#lib/seo.js';

  let { params } = $props();

  const data = $derived(await getBlogPostsByTag(params.name));
  const path = $derived(`/blog/tag/${encodeURIComponent(data.tag.name)}`);
  const description = $derived(
    data.tag.description ||
      `Articles tagged ${data.tag.name} on the porfirio.dev blog by Porfírio Ribeiro.`,
  );
  const breadcrumb = $derived([
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: 'Tags', path: '/blog/tag' },
    { name: data.tag.name, path },
  ]);
</script>

<Seo
  title={`${data.tag.name} — Blog | Porfírio Ribeiro`}
  {description}
  {path}
  noindex={data.posts.length === 0}
  jsonLd={[
    websiteSchema(description),
    personSchema(),
    collectionPageSchema({
      name: `${data.tag.name} articles`,
      description,
      path,
      breadcrumb,
    }),
    breadcrumbSchema(breadcrumb),
  ]}
/>

<h1>Tag: {data.tag.name}</h1>
{#if data.tag.description}
  <p class="description">{data.tag.description}</p>
{/if}

{#if data.posts.length > 0}
  <ArticleList posts={data.posts} />
{:else}
  <p>There are no published posts with this tag yet. <a href="/blog">Back to the blog</a>.</p>
{/if}

<style lang="scss">
  .description {
    color: var(--theme-muted);
    font-style: italic;
  }
</style>
