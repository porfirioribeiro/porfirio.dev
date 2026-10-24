<script lang="ts">
  import type { BlogPostFull } from "#lib/types/blog.js";
  import { blogPostingSchema, blogSchema, breadcrumbSchema, personSchema, websiteSchema } from "#lib/seo.js";
  import Seo from "./Seo.svelte";

  interface Props {
    post: BlogPostFull;
  }

  let { post }: Props = $props();

  const description = $derived(
    post.description ||
      `An article by Porfírio Ribeiro about software development on the porfirio.dev blog.`,
  );
  const tags = $derived(post.tags.map((tag) => tag.name));
  const breadcrumb = $derived([
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: post.title, path: post.link },
  ]);
</script>

<Seo
  title={`${post.title} — Porfírio Ribeiro`}
  {description}
  path={post.link}
  type="article"
  image={post.image}
  imageAlt={post.title}
  publishedTime={post.date}
  {tags}
  noindex={!post.isPublished}
  jsonLd={[
    websiteSchema(description),
    personSchema(),
    blogSchema(),
    blogPostingSchema(post),
    breadcrumbSchema(breadcrumb),
  ]}
/>
