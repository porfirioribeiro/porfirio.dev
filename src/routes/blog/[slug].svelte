<script lang="ts" context="module">
  export async function preload(page, session) {
    const { slug } = page.params;

    const res = await this.fetch(`${slug}.json`);
    const post = await res.json();

    return { post };
  }
</script>

<script lang="ts">
  import Markdown from "$components/Markdown.svelte";
  import type { Post } from "$src/utils/post";

  export let post: Post;
</script>

<h2>{post.title}</h2>
<Markdown html={post.html} />
