/**
 * Returns black or white, whichever has the higher WCAG contrast against a
 * hex background. Used for GitHub label chips, whose colours are arbitrary.
 */
export function readableTextColor(background: string | undefined): '#000000' | '#ffffff' {
  if (!background) return '#ffffff';

  const hex = background.trim().replace(/^#/, '');
  const full =
    hex.length === 3
      ? hex
          .split('')
          .map((character) => character + character)
          .join('')
      : hex;

  if (!/^[\da-f]{6}$/i.test(full)) return '#ffffff';

  const [r, g, b] = [0, 2, 4].map((offset) => {
    const channel = Number.parseInt(full.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });

  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  // The crossover point where black and white have equal contrast.
  return luminance > 0.1791 ? '#000000' : '#ffffff';
}
