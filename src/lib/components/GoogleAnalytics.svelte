<!-- <script lang="ts">
  import { page } from "$app/stores";

  export let id: string;

  if (typeof window !== "undefined") {
    (window as any).dataLayer = (window as any).dataLayer || [];
    window.gtag = function gtag() {
      (window as any).dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", id, { send_page_view: false });
  }
  $: {
    if (typeof gtag !== "undefined") {
      gtag("config", id, {
        page_path: $page.path,
      });
    }
  }
</script>


<svelte:head>
  <script async src="https://www.googletagmanager.com/gtag/js?id={id}"></script>
</svelte:head> -->
