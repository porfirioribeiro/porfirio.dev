<script lang="ts">
  import ArticleList from "$lib/components/ArticleList.svelte";
  import type { PageData } from "./$types";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
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
