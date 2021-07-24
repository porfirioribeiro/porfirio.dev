<script lang="ts">
  import { page } from "$app/stores";
  import Icon from "../icons/Icon.svelte";
</script>

<header>
  <div class="corner left">
    <a href="/">
      <img src="/android-chrome-192x192.png" alt="porfirio.dev" />
    </a>
  </div>

  <div class="menu-wrapper">
    <button>
      <svg width={24} height={24} view-port="0 0 24 24" fill="white">
        <rect x={0} y={2} width={24} height={4} />
        <rect x={0} y={10} width={24} height={4} />
        <rect x={0} y={18} width={24} height={4} />
      </svg>
    </button>
    <nav>
      <ul>
        <li class:active={$page.path === "/"}>
          <a sveltekit:prefetch href="/">Home</a>
        </li>
        <li class:active={$page.path === "/projects"}>
          <a sveltekit:prefetch href="/projects">Projects</a>
        </li>
        <li class:active={$page.path === "/resources"}>
          <a sveltekit:prefetch href="/resources">Resources</a>
        </li>
      </ul>
    </nav>
  </div>

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

<style lang="scss">
  header {
    display: flex;
    justify-content: space-between;
    /* background-color: var(--theme-surface); */
    background-color: rgba(255, 255, 255, 0.12);
  }

  .corner {
    width: 150px;
    height: 3em;
    display: flex;
    align-items: center;
  }

  .corner a {
    margin: 0 4px;
  }

  .corner img {
    width: 2em;
    height: 2em;
    object-fit: contain;
  }

  .corner.right {
    justify-content: flex-end;
    display: flex;
    margin-right: 8px;
  }

  .corner.right > a {
    color: white;
    width: 24px;
    transition: color 300ms ease-in-out;
    &:hover {
      color: var(--theme-secondary);
    }
  }

  nav {
    display: flex;
    justify-content: center;
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

    a {
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
  }

  button {
    background: transparent;
    border: none;
    cursor: pointer;

    rect {
      transition: transform 0.2s, fill 0.2s;
      transform-origin: center;
    }
  }

  @media (max-width: 719px) {
    nav {
      overflow: hidden;
      transition: all 0.2s linear;
      position: fixed;
      inset: 0;
      background: radial-gradient(
        76.34% 42.37% at 49.88% 0%,
        transparent 0%,
        var(--theme-background) 40%,
        var(--theme-background) 100%
      );
      align-items: center;
      ul {
        flex-direction: column;
      }
      a {
        line-height: 32px;
      }
      li.active a {
        text-decoration: underline var(--theme-primary) 2px;
        text-underline-offset: 5px;
      }
    }

    .menu-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .menu-wrapper:focus-within {
      button rect {
        &:nth-child(1) {
          transform: rotate(-45deg) translate(0px, 8px);
        }
        &:nth-child(2) {
          transform: scaleX(0);
        }
        &:nth-child(3) {
          transform: rotate(45deg) translate(0px, -8px);
        }
      }
    }

    .menu-wrapper:not(:focus-within) > nav {
      // transform: scale(0);
      pointer-events: none;
      opacity: 0;
    }
  }

  @media (min-width: 720px) {
    button {
      display: none;
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
  }

  a:hover {
    color: var(--theme-secondary);
  }
</style>
