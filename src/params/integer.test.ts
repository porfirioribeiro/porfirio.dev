import { describe, expect, it } from 'vite-plus/test';

import { match } from './integer.js';

describe('integer param matcher', () => {
  it('matches a positive integer', () => {
    expect(match('42')).toBe(true);
  });

  it('matches a single digit', () => {
    expect(match('0')).toBe(true);
  });

  it('rejects a negative number', () => {
    expect(match('-1')).toBe(false);
  });

  it('rejects a decimal', () => {
    expect(match('3.14')).toBe(false);
  });

  it('rejects an empty string', () => {
    expect(match('')).toBe(false);
  });

  it('rejects a non-numeric string', () => {
    expect(match('abc')).toBe(false);
  });

  it('rejects a string with leading non-digits', () => {
    expect(match('1abc')).toBe(false);
  });
});
