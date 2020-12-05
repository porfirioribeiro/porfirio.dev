<script lang="ts">
  import NavLink from "./NavLink.svelte";

  export let links: { s: string; t: string }[];
  export let segment: string;

  //segment might be undefined, so we use path to be a empty string
  let path: string;
  $: path = segment || "";

  let headerClass = "pin";
  let floating = false;
  let y = 0;
  let lastY = 0;
  let lastDirection = "up";
  let atTop = true;

  function changeClass(y) {
    let result = headerClass;
    const scrolledPxs = lastY - y;
    const scrollDirection = scrolledPxs < 0 ? "down" : "up";
    const changedDirection = scrollDirection !== lastDirection;
    atTop = y === 0;
    if (changedDirection) {
      result = scrollDirection === "down" ? "unpin" : "pin";
      floating = scrollDirection === "down";
      lastDirection = scrollDirection;
    }
    lastY = y;
    return result;
  }

  $: headerClass = changeClass(y);

  $: console.log(headerClass, floating, atTop);
</script>

<style lang="scss">
  $header-height: 60px;
  nav {
    position: sticky;
    // width: 100%;
    height: $header-height;
    background-color: white;
    z-index: 1;
    box-shadow: 0 -0.4rem 0.9rem 0.2rem rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: space-between;

    top: -$header-height;
    transition: top 300ms, box-shadow 200ms, background 200ms, color 200ms;

    padding: 0 16px;
  }

  .pin {
    top: 0;
  }

  .atTop {
    box-shadow: none;
  }
  ul {
    display: flex;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
  }
</style>

<svelte:window bind:scrollY={y} />
<nav class:pin={lastDirection == 'up'} class:atTop>
  <div>Porfirio.dev</div>
  <ul>
    {#each links as { s, t }}
      <NavLink href={`/${s}`} current={path === s}>{t}</NavLink>
    {/each}
  </ul>
</nav>
