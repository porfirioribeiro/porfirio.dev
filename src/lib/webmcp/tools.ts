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
