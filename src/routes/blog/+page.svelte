<script lang="ts">
  import ArticleList from "$lib/components/ArticleList.svelte";

  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<h1>Blog</h1>

<ArticleList posts={data.posts} />
