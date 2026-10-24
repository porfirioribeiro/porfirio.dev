<script lang="ts">
  import { page } from "$app/state";
  import Icon from "../icons/Icon.svelte";

  let menuOpen = $state(false);
  let menuWrapper: HTMLDivElement | undefined;
  let menuButton: HTMLButtonElement | undefined;
  let navEl: HTMLElement | undefined;

  function isActive(path: string) {
    return path === "/"
      ? page.url.pathname === "/"
      : page.url.pathname.startsWith(path);
  }

  function closeMenu() {
    menuOpen = false;
  }

  function menuFocusables() {
    if (!menuButton || !navEl) return [];
    return [menuButton, ...navEl.querySelectorAll<HTMLAnchorElement>("a[href]")];
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!menuOpen) return;

    if (event.key === "Escape") {
      closeMenu();
      menuButton?.focus();
      return;
    }

    if (event.key !== "Tab") return;

    const items = menuFocusables();
    const first = items[0];
    const last = items.at(-1);
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first?.focus();
    } else if (!menuWrapper?.contains(active)) {
      event.preventDefault();
      first?.focus();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<header>
  <div class="corner left">
    <a href="/" aria-label="porfirio.dev — home">
      <img
        src="/android-chrome-192x192.png"
        alt=""
        width="32"
        height="32"
        decoding="async"
      />
    </a>
  </div>

  <div class="menu-wrapper" class:open={menuOpen} bind:this={menuWrapper}>
    <button
      type="button"
      bind:this={menuButton}
      aria-label={menuOpen ? "Close menu" : "Open menu"}
      aria-expanded={menuOpen}
      aria-controls="site-nav"
      onclick={() => (menuOpen = !menuOpen)}
    >
      <svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="white"
        aria-hidden="true"
        focusable="false"
      >
        <rect x={0} y={2} width={24} height={4} />
        <rect x={0} y={10} width={24} height={4} />
        <rect x={0} y={18} width={24} height={4} />
      </svg>
    </button>
    <nav id="site-nav" aria-label="Main" bind:this={navEl}>
      <ul>
        <li class:active={isActive("/")}>
          <a
            href="/"
            aria-current={isActive("/") ? "page" : undefined}
            onclick={closeMenu}>Home</a
          >
        </li>
        <li class:active={isActive("/projects")}>
          <a
            href="/projects"
            aria-current={isActive("/projects") ? "page" : undefined}
            onclick={closeMenu}>Projects</a
          >
        </li>
        <li class:active={isActive("/skills")}>
          <a
            href="/skills"
            aria-current={isActive("/skills") ? "page" : undefined}
            onclick={closeMenu}>Skills</a
          >
        </li>
        <li class:active={isActive("/resources")}>
          <a
            href="/resources"
            aria-current={isActive("/resources") ? "page" : undefined}
            onclick={closeMenu}>Resources</a
          >
        </li>
        <li class:active={isActive("/blog")}>
          <a
            href="/blog"
            aria-current={isActive("/blog") ? "page" : undefined}
            onclick={closeMenu}>Blog</a
          >
        </li>
      </ul>
    </nav>
  </div>

  <div class="corner right">
    <a
      href="https://github.com/porfirioribeiro"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Porfírio Ribeiro on GitHub"
    >
      <Icon icon="logo-github" />
    </a>
    <a
      href="https://twitter.com/porfirio"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Porfírio Ribeiro on Twitter"
    >
      <Icon icon="logo-twitter" />
    </a>
    <a
      href="https://linkedin.com/in/porfirioribeiro"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Porfírio Ribeiro on LinkedIn"
    >
      <Icon icon="logo-linkedin" />
    </a>
  </div>
</header>

<style lang="scss">
  header {
    display: flex;
    justify-content: space-between;
    background-color: rgba(255, 255, 255, 0.06);
    border-bottom: 1px solid var(--theme-border);
    box-shadow: 0 1px 0 0 rgba(3, 218, 198, 0.15);
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
      transition:
        opacity 0.2s linear,
        visibility 0.2s linear;
      position: fixed;
      inset: 0;
      z-index: 1;
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

    .menu-wrapper button {
      position: relative;
      z-index: 2;
    }

    .menu-wrapper.open button rect {
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

    .menu-wrapper:not(.open) > nav {
      // transform: scale(0);
      pointer-events: none;
      opacity: 0;
      visibility: hidden;
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
