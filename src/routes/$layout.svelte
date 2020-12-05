<script lang="ts">
  import Nav from "$components/Nav.svelte";
  // import { fade } from "svelte/transition";
  import { page } from "$app/stores";

  export let segment: string;

  const re = /^\/([^\/]*).*/;

  $: segmentFixed = segment || $page.path.replace(re, "$1");

  const links = [
    { s: "", t: "Home" },
    { s: "about", t: "About" },
    { s: "blog", t: "Blog" },
  ];
</script>

<style lang="scss">
  // div {
  //   position: relative;
  // }
  // main {
  //   position: absolute;
  //   width: 100vw;
  //   height: 100%;
  // }
</style>

<Nav {links} segment={segmentFixed} />
<slot />

<!-- <div>
  {#key $page.path}
    <main out:fade in:fade={{ delay: 400, duration: 400 }}>
      <slot />
    </main>
  {/key}
</div> -->
