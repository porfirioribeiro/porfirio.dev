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
  From the last years of self-taught learning I've read, listen and saw so many
  interesting things to help me grow on my career as a developer. Here I specify
  some of them like books and podcasts. Later I hope to increment this list with
  more content like videos and courses
</p>

<h3>Books</h3>

<p>A list of some books I enjoyed reading and I found interesting.</p>

<Resources resources={data.books} />

<h3>Podcasts</h3>

<p>
  A list of podcasts I enjoy listen to while I'm going for a walk every morning
</p>

<Resources resources={data.podcasts} />

<h3>Courses</h3>

<p>
  Some courses I took completely or partially to increase my learning on some
  subjects
</p>

<Resources resources={data.courses} />
