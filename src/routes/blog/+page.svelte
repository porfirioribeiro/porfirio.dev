<script lang="ts">
  import ArticleList from '#lib/components/ArticleList.svelte';
  import BlogSearch from '#lib/components/BlogSearch.svelte';
  import { getBlogPosts, getBlogTags } from '#lib/blog.remote.js';
  import { useWebMCP } from '#lib/webmcp/index.js';
  import { filterPosts, searchBlogTool, listBlogTagsTool } from '#lib/webmcp/blog-tools.js';
  import type { BlogPostItem } from '#lib/types/blog.js';

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

<h1>Blog</h1>

<BlogSearch bind:query onQuery={(q) => (query = q)} />

{#if filtered}
  <ArticleList posts={filtered} />
{:else}
  <ArticleList posts={await posts} />
{/if}
