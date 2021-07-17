<script lang="ts">
  import { page } from "$app/stores";
  import Icon from "../icons/Icon.svelte";
</script>

<header>
  <div class="corner">
    <a href="/">
      <img src="/android-chrome-192x192.png" alt="porfirio.dev" />
    </a>
  </div>

  <nav>
    <ul>
      <li class:active={$page.path === "/"}>
        <a sveltekit:prefetch href="/">Home</a>
      </li>
      <li class:active={$page.path === "/about"}>
        <a sveltekit:prefetch href="/about">About</a>
      </li>
      <li class:active={$page.path === "/resources"}>
        <a sveltekit:prefetch href="/resources">Resources</a>
      </li>
    </ul>
  </nav>

  <div class="corner right">
    <a
      href="https://github.com/porfirioribeiro"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon icon="logo-github" />
    </a>
    <a
      href="https://twitter.com/porfirio"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon icon="logo-twitter" />
    </a>
    <a
      href="https://linkedin.com/in/porfirioribeiro"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon icon="logo-linkedin" />
    </a>
  </div>
</header>

<style>
  header {
    display: flex;
    justify-content: space-between;
    /* background-color: var(--theme-surface); */
    background-color: rgba(255, 255, 255, 0.12);
  }

  .corner {
    /* width: 3em; */
    height: 3em;
  }

  .corner a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    margin: 0 4px;
  }

  .corner img {
    width: 2em;
    height: 2em;
    object-fit: contain;
  }

  .corner.right {
    display: flex;
  }
  .corner.right > a {
    color: white;
    width: 24px;
  }

  nav {
    display: flex;
    justify-content: center;
  }

  ul {
    position: relative;
    padding: 0;
    margin: 0;
    height: 3em;
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
  }

  li {
    position: relative;
    height: 100%;
  }

  li.active::before {
    --size: 6px;
    content: "";
    width: 0;
    height: 0;
    position: absolute;
    top: 0;
    left: calc(50% - var(--size));
    border: var(--size) solid transparent;
    border-top: var(--size) solid var(--theme-secondary);
  }

  nav a {
    display: flex;
    height: 100%;
    align-items: center;
    padding: 0 1em;
    color: var(--theme-on-surface);
    font-weight: 700;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 10%;
    text-decoration: none;
    transition: color 0.2s linear;
  }

  a:hover {
    color: var(--theme-secondary);
  }
</style>
