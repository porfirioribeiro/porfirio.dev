import { describe, expect, it } from 'vite-plus/test';
import { normaliseHeadings } from './html.js';

describe('normaliseHeadings', () => {
  it('promotes a body that starts at h3 so it follows the page h1', () => {
    expect(normaliseHeadings('<h3>Sub</h3><p>text</p><h4>Detail</h4>')).toBe(
      '<h2>Sub</h2><p>text</p><h3>Detail</h3>',
    );
  });

  it('demotes a body that contains h1', () => {
    expect(normaliseHeadings('<h1>Title</h1><h2>Sub</h2>')).toBe('<h2>Title</h2><h3>Sub</h3>');
  });

  it('leaves content without headings untouched', () => {
    expect(normaliseHeadings('<p>No headings</p>')).toBe('<p>No headings</p>');
  });

  it('keeps attributes and closing tags intact', () => {
    expect(normaliseHeadings('<h3 id="x" class="a">Hi</h3>')).toBe('<h2 id="x" class="a">Hi</h2>');
  });
});
