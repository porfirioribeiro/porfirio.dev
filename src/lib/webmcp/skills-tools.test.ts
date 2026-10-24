import { describe, expect, it } from 'vite-plus/test';
import { filterSkillsTool, listSkillsTool, type SkillFilterSetter } from './skills-tools.js';

const categories = [
  { name: 'Working with', items: ['Vue', 'Nuxt'] },
  { name: 'Having fun', items: ['Rust'] },
];

// Tool factories in this module read categories from the data module, but
// accept them for testability. listSkillsTool takes names; for filtering we
// exercise the same code path the page uses via the data import.
describe('listSkillsTool', () => {
  it('filters by category name when given', () => {
    const tool = listSkillsTool(categories);
    const result = tool.execute({ category: 'Having fun' });
    expect(result).toEqual({ categories: [{ name: 'Having fun', items: ['Rust'] }] });
  });

  it('returns all categories when no filter is given', () => {
    const tool = listSkillsTool(categories);
    const result = tool.execute({});
    expect(result).toEqual({ categories });
  });
});

describe('filterSkillsTool', () => {
  it('sets the page filter and reports the visible categories', () => {
    let selected: string | null = null;
    const tool = filterSkillsTool(categories, ((name: string | null) => {
      selected = name;
    }) as SkillFilterSetter);
    const result = tool.execute({ category: 'Working with' });
    expect(selected).toBe('Working with');
    expect(result.visible).toEqual(['Working with']);
  });

  it('resets the filter on "all"', () => {
    let selected: string | null = 'Working with';
    const tool = filterSkillsTool(categories, ((name: string | null) => {
      selected = name;
    }) as SkillFilterSetter);
    const result = tool.execute({ category: 'all' });
    expect(selected).toBe(null);
    expect(result.visible).toEqual(['Working with', 'Having fun']);
  });
});
