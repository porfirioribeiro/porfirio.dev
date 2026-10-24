import { profile } from '#lib/data/profile.js';
import type { Project } from '#lib/data/projects.js';

export const SITE_ORIGIN = 'https://porfirio.dev';

/** Turns a site-relative path into an absolute URL agents can cite. */
export function absoluteUrl(path: string): string {
  return `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Tool: returns facts about the site's author. */
export function getProfileTool() {
  return {
    name: 'get_profile',
    title: 'Get profile',
    description:
      'Returns facts about the author of porfirio.dev (Porfírio Ribeiro): what the site is, technologies he is exploring, and useful links such as his GitHub profile and blog.',
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: true },
    execute: () => ({
      ...profile,
      exploring: [...profile.exploring],
      links: profile.links.map((link) => ({ ...link })),
    }),
  };
}

/** Tool: returns the author's open-source projects with absolute URLs. */
export function listProjectsTool(projectList: Project[]) {
  return {
    name: 'list_projects',
    title: 'List projects',
    description:
      'Lists the open-source projects of porfirio.dev: name, short description, technologies used, and links to their repositories/packages.',
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: true },
    execute: () => ({
      projects: projectList.map((project) => ({
        name: project.name,
        description: project.description,
        tech: project.tech.map((t) => t.name),
        links: project.links.map((link) => ({ label: link.label, url: link.href })),
      })),
    }),
  };
}

type PageGuide = { path: string; description: string; tools: string[] };

const TOOL_PAGES: PageGuide[] = [
  {
    path: '/about',
    description: 'Who Porfírio is and the story of this website.',
    tools: ['get_profile'],
  },
  {
    path: '/skills',
    description: 'Skills grouped by current stack, previous experience, and exploration.',
    tools: ['list_skills', 'filter_skills'],
  },
  {
    path: '/projects',
    description: 'Small open-source projects built as learning tools or for daily work.',
    tools: ['list_projects'],
  },
  {
    path: '/blog',
    description:
      'Blog posts about tech, read from GitHub issues. Individual posts additionally expose get_current_article.',
    tools: ['search_blog', 'list_blog_tags', 'search_blog_form'],
  },
  {
    path: '/resources',
    description: 'Recommended books, podcasts, and courses.',
    tools: ['list_resources'],
  },
];

/**
 * Tool: site map for agents. Registered on the home page so an agent landing
 * on the site immediately learns who this is and which tools live where.
 */
export function siteOverviewTool() {
  return {
    name: 'site_overview',
    title: 'Site overview',
    description:
      'Describes porfirio.dev — who the author is and which WebMCP tools are available on each page — so an agent can navigate to the right page to use them.',
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: true },
    execute: () => ({
      site: profile.siteName,
      tagline: profile.tagline,
      about: profile.about,
      exploring: [...profile.exploring],
      links: profile.links.map((link) => ({ ...link })),
      pages: TOOL_PAGES.map((page) => ({
        url: absoluteUrl(page.path),
        description: page.description,
        tools: [...page.tools],
      })),
      note: 'WebMCP tools are registered only while their page is open — navigate to a page before calling its tools.',
    }),
  };
}
