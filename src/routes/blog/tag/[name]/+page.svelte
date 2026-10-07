<script lang="ts">
  import ArticleList from '#lib/components/ArticleList.svelte';
  import { getBlogPostsByTag } from '#lib/blog.remote.js';

  let { params } = $props();

  const data = $derived(await getBlogPostsByTag(params.name));
</script>

<svelte:head>
  <title>Tag: {data.tag.name}</title>
  <meta name="description" content={data.tag.description} />
</svelte:head>

<h1>Tag: {data.tag.name}</h1>
<p>
  <i>{data.tag.description}</i>
</p>

<ArticleList posts={data.posts} />
