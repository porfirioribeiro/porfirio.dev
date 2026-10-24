import { skillCategories } from './skills.js';

/**
 * Facts about the site and its author, derived only from content that
 * already exists on the site. Add fields here only when the site itself
 * states them — agents treat this as truth.
 */
export const profile = {
  siteName: 'porfirio.dev',
  tagline: 'Personal site and blog of Porfírio Ribeiro, over-engineered with SvelteKit.',
  about:
    'A personal website and blog by Porfírio Ribeiro. After years of restarting his site on every new framework (PHP, Ghost, Gatsby, Sapper), he settled on SvelteKit — and, as the site itself puts it, finally stopped over-engineering it. Content includes a blog, open-source projects, skills, and learning resources.',
  exploring: skillCategories.find((c) => c.name === 'Having fun & exploring')?.items ?? [],
  links: [
    { label: 'GitHub', href: 'https://github.com/porfirioribeiro' },
    { label: 'Blog', href: 'https://porfirio.dev/blog' },
    { label: 'RSS', href: 'https://porfirio.dev/blog/rss.xml' },
  ],
};
