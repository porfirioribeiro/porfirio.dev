import { profile } from './data/profile.js';
import type { BlogPostFull } from './types/blog.js';

/** Canonical public origin. Keep in sync with `wrangler.jsonc` and `static/robots.txt`. */
export const SITE_URL = 'https://porfirio.dev';
export const SITE_NAME = 'porfirio.dev';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/social-card.png`;

/** Stable identifiers that connect the JSON-LD entities across pages. */
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const BLOG_ID = `${SITE_URL}/blog/#blog`;

type JsonLdNode = Record<string, unknown>;

/** Normalises a path to a canonical absolute URL (no query, hash or trailing slash). */
export function absoluteUrl(path: string): string {
  const url = new URL(path, SITE_URL);
  url.hash = '';
  url.search = '';
  if (url.pathname !== '/') url.pathname = url.pathname.replace(/\/+$/, '');
  return url.toString();
}

export function personSchema(): JsonLdNode {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: profile.name,
    url: `${SITE_URL}/`,
    jobTitle: profile.jobTitle,
    description: 'Self-taught software developer from Portugal working across the full stack.',
    email: `mailto:${profile.email}`,
    address: { '@type': 'PostalAddress', addressCountry: 'PT' },
    sameAs: [...profile.sameAs],
  };
}

export function websiteSchema(description: string): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    alternateName: profile.name,
    description,
    inLanguage: 'en',
    publisher: { '@id': PERSON_ID },
  };
}

export function profilePageSchema(description: string): JsonLdNode {
  return {
    '@type': 'ProfilePage',
    '@id': `${SITE_URL}/#profile`,
    url: `${SITE_URL}/`,
    name: `${profile.name} — ${profile.jobTitle}`,
    description,
    inLanguage: 'en',
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': PERSON_ID },
    mainEntity: { '@id': PERSON_ID },
  };
}

const BLOG_DESCRIPTION =
  'Notes and articles by Porfírio Ribeiro about software development and the things he is learning.';

export function blogSchema(): JsonLdNode {
  return {
    '@type': 'Blog',
    '@id': BLOG_ID,
    url: `${SITE_URL}/blog`,
    name: `${profile.name} — Blog`,
    description: BLOG_DESCRIPTION,
    inLanguage: 'en',
    isPartOf: { '@id': WEBSITE_ID },
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
  };
}

export type BreadcrumbItem = { name: string; path: string };

export function breadcrumbSchema(items: BreadcrumbItem[]): JsonLdNode {
  const last = items.at(-1);
  return {
    '@type': 'BreadcrumbList',
    '@id': `${absoluteUrl(last?.path ?? '/')}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function blogPostingSchema(post: BlogPostFull): JsonLdNode {
  const url = absoluteUrl(post.link);
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    url,
    headline: post.title,
    description:
      post.description ||
      `An article by ${profile.name} on the ${SITE_NAME} blog about software development.`,
    datePublished: post.date,
    inLanguage: 'en',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    isPartOf: { '@id': BLOG_ID },
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
    ...(post.image ? { image: absoluteUrl(post.image) } : {}),
    ...(post.tags.length ? { keywords: post.tags.map((tag) => tag.name).join(', ') } : {}),
  };
}

export function collectionPageSchema(options: {
  name: string;
  description: string;
  path: string;
  breadcrumb: BreadcrumbItem[];
}): JsonLdNode {
  const url = absoluteUrl(options.path);
  return {
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    url,
    name: options.name,
    description: options.description,
    inLanguage: 'en',
    isPartOf: { '@id': WEBSITE_ID },
    breadcrumb: {
      '@id': `${absoluteUrl(options.breadcrumb.at(-1)?.path ?? options.path)}#breadcrumb`,
    },
  };
}

/** Escapes `<` so a JSON-LD payload can never terminate its script element early. */
export function serialiseJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
