<script lang="ts">
  export let segment: string;

  $: console.log(segment);
</script>

<nav>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
    <li><a href="/blog">Blog</a></li>
  </ul>
</nav>

<slot />
