<script lang="ts" context="module">
  export async function preload(page, session) {
    const res = await this.fetch(`/blog.json`);
    const posts = await res.json();

    return { posts };
  }
</script>

<script lang="ts">
  import type { Post } from "$src/routes/blog/_utils/post";

  export let posts: Post[];

  $: console.log(posts);
</script>

<h1>Blog</h1>

{#each posts as post}
    <a href={`blog/${post.slug}`}>{post.slug}</a>
{/each}
<h4>sdsdsdsss</h4>
