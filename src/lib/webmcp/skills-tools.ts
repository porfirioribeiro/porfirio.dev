import type { SkillCategory } from '#lib/data/skills.js';

type ExecuteResult = Record<string, unknown>;

export type SkillFilterSetter = (name: string | null) => void;

/**
 * Tool: returns the skill categories, optionally filtered to one category.
 * Read-only — it answers questions, it does not change the page.
 */
export function listSkillsTool(categories: SkillCategory[]) {
  const categoryNames = categories.map((c) => c.name);
  return {
    name: 'list_skills',
    title: 'List skills',
    description:
      'Lists the skills of porfirio.dev author Porfírio Ribeiro, grouped by category: "Working with" (current daily stack), "Previous experience" (worked with professionally in the past), and "Having fun & exploring" (personal exploration). Optionally filter to a single category.',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          enum: categoryNames,
          description: 'Only return skills from this category. Omit to return all categories.',
        },
      },
    },
    annotations: { readOnlyHint: true },
    execute: (input: Record<string, unknown>): ExecuteResult => {
      const category = typeof input.category === 'string' ? input.category : undefined;
      const filtered = category ? categories.filter((c) => c.name === category) : categories;
      return { categories: filtered };
    },
  };
}

/**
 * Interactive tool: sets the category filter visible on the page — the same
 * state the filter chips set, so the UI updates to reflect the agent's
 * action (the WebMCP "UI synchronization" requirement).
 */
export function filterSkillsTool(categories: SkillCategory[], setCategory: SkillFilterSetter) {
  const categoryNames = categories.map((c) => c.name);
  return {
    name: 'filter_skills',
    title: 'Filter skills on the page',
    description:
      'Filters the skills shown on the currently open page to a single category, updating the visible UI. Pass "all" to clear the filter and show every category.',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          enum: ['all', ...categoryNames],
          description: 'The category to show, or "all" to clear the filter.',
        },
      },
      required: ['category'],
    },
    annotations: { readOnlyHint: false },
    execute: (input: Record<string, unknown>): ExecuteResult => {
      const category = typeof input.category === 'string' ? input.category : 'all';
      setCategory(category === 'all' ? null : category);
      const visible =
        category === 'all' ? categoryNames : categoryNames.filter((n) => n === category);
      return { visible, message: `Showing: ${visible.join(', ')}` };
    },
  };
}
