import { describe, expect, it } from 'vite-plus/test';
import { absoluteUrl, siteOverviewTool } from './tools.js';

describe('absoluteUrl', () => {
  it('joins a leading-slash path onto the site origin', () => {
    expect(absoluteUrl('/blog')).toBe('https://porfirio.dev/blog');
  });
  it('adds a leading slash when missing', () => {
    expect(absoluteUrl('blog')).toBe('https://porfirio.dev/blog');
  });
});

describe('siteOverviewTool', () => {
  const result = () => siteOverviewTool().execute() as Record<string, unknown>;

  it('describes the site identity from the profile', () => {
    const r = result();
    expect(r.site).toBe('porfirio.dev');
    expect(typeof r.about).toBe('string');
    expect(Array.isArray(r.exploring)).toBe(true);
  });

  it('maps every tool-bearing route to its tools with absolute URLs', () => {
    const r = result();
    const pages = r.pages as Array<{ url: string; tools: string[] }>;
    const byUrl = Object.fromEntries(pages.map((p) => [p.url, p.tools]));

    expect(Object.keys(byUrl).sort()).toEqual([
      'https://porfirio.dev/about',
      'https://porfirio.dev/blog',
      'https://porfirio.dev/projects',
      'https://porfirio.dev/resources',
      'https://porfirio.dev/skills',
    ]);
    expect(byUrl['https://porfirio.dev/about']).toEqual(['get_profile']);
    expect(byUrl['https://porfirio.dev/skills']).toEqual(['list_skills', 'filter_skills']);
    expect(byUrl['https://porfirio.dev/blog']).toEqual(
      expect.arrayContaining(['search_blog', 'list_blog_tags', 'search_blog_form']),
    );
    expect(byUrl['https://porfirio.dev/resources']).toEqual(['list_resources']);
    expect(byUrl['https://porfirio.dev/projects']).toEqual(['list_projects']);
  });

  it('tells agents tools are page-scoped and ephemeral', () => {
    const r = result();
    expect(String(r.note)).toMatch(/while their page is open/i);
  });
});
