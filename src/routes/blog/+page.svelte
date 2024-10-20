<script lang="ts">
  import ArticleList from "$lib/components/ArticleList.svelte";

  import type { PageData } from "./$types";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
</script>

<h1>Blog</h1>

<ArticleList posts={data.posts} />
