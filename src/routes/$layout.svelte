<script lang="ts">
  import Nav from "$components/Nav.svelte";
  import { fade } from "svelte/transition";

  export let segment: string;

  const links = [
    { s: "", t: "Home" },
    { s: "about", t: "About" },
    { s: "blog", t: "Blog" },
  ];
</script>

<style lang="scss">
  div {
    position: relative;
  }
  main {
    position: absolute;
    width: 100vw;
  }
</style>

<Nav {links} {segment} />
<div>
  {#key segment}
    <main transition:fade>
      <slot />
    </main>
  {/key}
</div>
