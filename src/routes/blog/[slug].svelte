<script lang="ts" context="module">
  export async function preload(page, session) {
    // the `slug` parameter is available because this file
    // is called [slug].svelte
    const { slug } = page.params;

    console.log(page,'sdsdsdsd');
    console.log(this);
    

    // `this.fetch` is a wrapper around `fetch` that allows
    // you to make credentialled requests on both
    // server and client
    // const res = await this.fetch(`blog/${slug}.json`);
    // const article = await res.json();

    return { slug };
  }
</script>

<script lang="ts">
  export let slug: string;

  $: console.log(slug);
</script>

<h2>Blog: {slug}</h2>
