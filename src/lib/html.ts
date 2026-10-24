/**
 * Shifts headings in rendered article HTML so the shallowest heading becomes
 * `h2`. The page already provides the `h1`, and GitHub issue bodies often start
 * at `h3`, which would otherwise skip a level.
 */
export function normaliseHeadings(html: string): string {
  const levels = [...html.matchAll(/<h([1-6])\b/gi)].map((match) => Number(match[1]));
  if (!levels.length) return html;

  const shift = 2 - Math.min(...levels);
  if (shift === 0) return html;

  return html.replace(/<(\/?)h([1-6])\b/gi, (_, closing: string, level: string) => {
    const next = Math.min(6, Math.max(2, Number(level) + shift));
    return `<${closing}h${next}`;
  });
}
