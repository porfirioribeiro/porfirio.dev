import { describe, expect, it } from 'vite-plus/test';
import { skillCategories } from './skills.js';

describe('skillCategories', () => {
  it('has the three site categories', () => {
    expect(skillCategories.map((c) => c.name)).toEqual([
      'Working with',
      'Previous experience',
      'Having fun & exploring',
    ]);
  });
  it('has no empty categories', () => {
    for (const c of skillCategories) expect(c.items.length).toBeGreaterThan(0);
  });
});
