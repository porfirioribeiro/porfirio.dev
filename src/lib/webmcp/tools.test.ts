import { describe, expect, it } from 'vite-plus/test';
import { absoluteUrl } from './tools.js';

describe('absoluteUrl', () => {
  it('joins a leading-slash path onto the site origin', () => {
    expect(absoluteUrl('/blog')).toBe('https://porfirio.dev/blog');
  });
  it('adds a leading slash when missing', () => {
    expect(absoluteUrl('blog')).toBe('https://porfirio.dev/blog');
  });
});
