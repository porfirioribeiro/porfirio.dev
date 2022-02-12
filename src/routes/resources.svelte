<script context="module" lang="ts">
  export const prerender = true;

  import { books } from "$lib/resources/books";
  import { podcasts } from "$lib/resources/podcasts";
  import { courses } from "$lib/resources/courses";

  export function load() {
    return {
      props: {
        books,
        podcasts,
        courses,
      },
    };
  }
</script>

<script lang="ts">
  import Resources from "$lib/resources/index.svelte";
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

<Resources resources={books} />

<h3>Podcasts</h3>

<p>
  A list of podcasts I enjoy listen to while I'm going for a walk every morning
</p>

<Resources resources={podcasts} />

<h3>Courses</h3>

<p>
  Some courses I took completely or partially to increase my learning on some
  subjects
</p>

<Resources resources={courses} />
