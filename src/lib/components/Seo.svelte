<script lang="ts">
  import { page } from '$app/state';
  import {
    absoluteUrl,
    DEFAULT_OG_IMAGE,
    SITE_NAME,
    SITE_URL,
    serialiseJsonLd,
  } from '#lib/seo.js';

  interface Props {
    title: string;
    description: string;
    /** Canonical path. Defaults to the current URL. */
    path?: string;
    type?: 'website' | 'article';
    image?: string;
    imageAlt?: string;
    publishedTime?: string;
    tags?: string[];
    noindex?: boolean;
    jsonLd?: unknown;
  }

  let {
    title,
    description,
    path,
    type = 'website',
    image = DEFAULT_OG_IMAGE,
    imageAlt = 'Porfírio Ribeiro — software developer',
    publishedTime,
    tags = [],
    noindex = false,
    jsonLd,
  }: Props = $props();

  const canonical = $derived(absoluteUrl(path ?? page.url.pathname));
  const imageUrl = $derived(absoluteUrl(image));
  const json = $derived(jsonLd ? serialiseJsonLd(jsonLd) : null);
  const jsonScript = $derived(
    json ? `<script type="application/ld+json">${json}</${'script'}>` : null,
  );
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  {#if noindex}
    <meta name="robots" content="noindex, follow" />
  {/if}
  <link rel="canonical" href={canonical} />

  <meta property="og:type" content={type} />
  <meta property="og:site_name" content={SITE_NAME} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonical} />
  <meta property="og:image" content={imageUrl} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content={imageAlt} />
  <meta property="og:locale" content="en_GB" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@porfirio" />
  <meta name="twitter:creator" content="@porfirio" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={imageUrl} />
  <meta name="twitter:image:alt" content={imageAlt} />

  {#if publishedTime}
    <meta property="article:published_time" content={publishedTime} />
    <meta property="article:author" content={`${SITE_URL}/about`} />
    {#each tags as tag (tag)}
      <meta property="article:tag" content={tag} />
    {/each}
  {/if}

  {#if jsonScript}
    {@html jsonScript}
  {/if}
</svelte:head>
