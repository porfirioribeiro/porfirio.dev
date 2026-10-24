<script lang="ts">
  import ArticleList from '#lib/components/ArticleList.svelte';
  import BlogSearch from '#lib/components/BlogSearch.svelte';
  import Seo from '#lib/components/Seo.svelte';
  import { getBlogPosts, getBlogTags } from '#lib/blog.remote.js';
  import { blogSchema, breadcrumbSchema, personSchema, websiteSchema } from '#lib/seo.js';
  import { useWebMCP } from '#lib/webmcp/index.js';
  import { filterPosts, searchBlogTool, listBlogTagsTool } from '#lib/webmcp/blog-tools.js';
  import type { BlogPostItem } from '#lib/types/blog.js';

  const description =
    'Notes and articles by Porfírio Ribeiro about software development, the tools he uses and the things he is learning.';

  const posts = getBlogPosts();

  let query = $state('');
  let clientPosts = $state<BlogPostItem[] | null>(null);

  // Hydrate a client-side copy for filtering and tool queries; the
  // server-rendered list stays as the no-JS / pre-hydration view.
  $effect(() => {
    let alive = true;
    posts.then((p) => {
      if (alive) clientPosts = p;
    });
    return () => {
      alive = false;
    };
  });

  const filtered = $derived.by(() => {
    const q = query.trim();
    if (!q || !clientPosts) return null;
    return filterPosts(clientPosts, q);
  });

  useWebMCP(() => [searchBlogTool(() => clientPosts ?? []), listBlogTagsTool(() => getBlogTags())]);
</script>

<Seo
  title="Blog — Porfírio Ribeiro | porfirio.dev"
  {description}
  jsonLd={[
    websiteSchema(description),
    personSchema(),
    blogSchema(),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Blog', path: '/blog' },
    ]),
  ]}
/>

<h1>Blog</h1>

<p>
  I write about software development and the things I learn along the way.
  Browse <a href="/blog/tag">posts by tag</a> or subscribe to the
  <a href="/blog/rss.xml">RSS feed</a>.
</p>

<BlogSearch bind:query onQuery={(q) => (query = q)} />

{#if filtered}
  <ArticleList posts={filtered} />
{:else}
  <ArticleList posts={await posts} />
{/if}
