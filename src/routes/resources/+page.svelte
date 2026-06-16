<script lang="ts">
  import Resources from "$lib/resources/index.svelte";
  import type { PageData } from "./$types";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
</script>

<svelte:head>
  <title>Resources</title>
  <meta name="description" content="porfirio.dev - Resources" />
</svelte:head>

<h1>Resources</h1>

<p>
  Over the last few years of self-taught learning I've read, listened to, and watched so many
  interesting things that helped me grow in my career as a developer. Here I highlight
  some of them — books, podcasts, and courses.
</p>

<h3>Books</h3>

<p>A list of some books I enjoyed reading and I found interesting.</p>

<Resources resources={data.books} />

<h3>Podcasts</h3>

<p>Podcasts I enjoy listening to on my morning walks.</p>

<Resources resources={data.podcasts} />

<h3>Courses</h3>

<p>
  Courses I took fully or partially to deepen my knowledge on specific topics.
</p>

<Resources resources={data.courses} />
