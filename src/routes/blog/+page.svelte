<script lang="ts">
  import ArticleList from '#lib/components/ArticleList.svelte';
  import { getBlogPosts } from '#lib/blog.remote.js';

  const posts = getBlogPosts();
</script>

<h1>Blog</h1>

<ArticleList posts={await posts} />
