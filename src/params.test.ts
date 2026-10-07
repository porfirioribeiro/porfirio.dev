import { describe, expect, it } from 'vite-plus/test';

import { matchInteger } from './params.js';

describe('integer param matcher', () => {
  it('parses a positive integer', () => {
    expect(matchInteger('42')).toBe(42);
  });

  it('parses a single digit', () => {
    expect(matchInteger('0')).toBe(0);
  });

  it('rejects a negative number', () => {
    expect(matchInteger('-1')).toBeUndefined();
  });

  it('rejects a decimal', () => {
    expect(matchInteger('3.14')).toBeUndefined();
  });

  it('rejects an empty string', () => {
    expect(matchInteger('')).toBeUndefined();
  });

  it('rejects a non-numeric string', () => {
    expect(matchInteger('abc')).toBeUndefined();
  });

  it('rejects a string with leading non-digits', () => {
    expect(matchInteger('1abc')).toBeUndefined();
  });
});
