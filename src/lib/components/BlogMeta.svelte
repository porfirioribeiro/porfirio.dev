<script lang="ts">
  import type { BlogPostFull } from "$lib/types/blog";

  export let post: BlogPostFull;
</script>

<svelte:head>
  <title>{post.title}</title>
  <meta name="description" content={post.description} />
  <meta name="keywords" content={post.keywords} />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:site" content="@porfirio" />
  <meta name="twitter:creator" content="@porfirio" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content={post.title} />
  <meta property="og:description" content={post.description} />
  <meta property="og:image" content={post.image} />
  <meta property="og:url" content={post.link} />
  <meta property="og:site_name" content="Porfírio dev" />
  <meta property="article:published_time" content={post.date} />
  <meta property="article:author" content="Porfírio" />
  <meta property="article:tag" content={post.keywords} />
  <link rel="canonical" href={post.link} />
</svelte:head>
