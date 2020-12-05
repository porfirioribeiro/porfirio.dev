<script lang="ts" context="module">
  import { crossfade, fade } from "svelte/transition";
  const [send, receive] = crossfade({ fallback: fade });
</script>

<script lang="ts">
  export let href: string;
  export let current: boolean;
</script>

<style lang="scss">
  li {
    transition: color 0.2s, border 0.2s, padding 0.2s;
    color: gray;
    position: relative;
  }

  li[aria-current] {
    color: green;
  }

  li:hover:not([aria-current]) {
    color: blue;
  }

  a {
    color: inherit;
    text-decoration: none;
    padding: 8px;
  }

  .underline {
    position: absolute;
    left: 8px;
    right: 8px;
    height: 2px;
    background-color: rebeccapurple;
  }
</style>

<li aria-current={current ? 'page' : undefined}>
  <a rel="prefetch" {href}><slot /></a>
  {#if current}
    <div in:receive out:send class="underline" />
  {/if}
</li>
