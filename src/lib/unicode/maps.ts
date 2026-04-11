/** Mathematical Sans-Serif Bold / Italic / Bold-Italic - paste-safe in LinkedIn as plain Unicode. */

function buildBoldMap(): Record<string, string> {
  const m: Record<string, string> = {};
  for (let i = 0; i < 26; i++) {
    m[String.fromCharCode(65 + i)] = String.fromCodePoint(0x1d5d4 + i);
    m[String.fromCharCode(97 + i)] = String.fromCodePoint(0x1d5ee + i);
  }
  for (let i = 0; i < 10; i++) {
    m[String.fromCharCode(48 + i)] = String.fromCodePoint(0x1d7ec + i);
  }
  return m;
}

function buildItalicMap(): Record<string, string> {
  const m: Record<string, string> = {};
  for (let i = 0; i < 26; i++) {
    m[String.fromCharCode(65 + i)] = String.fromCodePoint(0x1d608 + i);
    m[String.fromCharCode(97 + i)] = String.fromCodePoint(0x1d622 + i);
  }
  return m;
}

/** Mathematical Sans-Serif Bold Italic (A–Z, a–z, 0–9). */
function buildBoldItalicMap(): Record<string, string> {
  const m: Record<string, string> = {};
  for (let i = 0; i < 26; i++) {
    m[String.fromCharCode(65 + i)] = String.fromCodePoint(0x1d63c + i);
    m[String.fromCharCode(97 + i)] = String.fromCodePoint(0x1d656 + i);
  }
  for (let i = 0; i < 10; i++) {
    m[String.fromCharCode(48 + i)] = String.fromCodePoint(0x1d7f6 + i);
  }
  return m;
}

export const BOLD_MAP = buildBoldMap();
export const ITALIC_MAP = buildItalicMap();
export const BOLD_ITALIC_MAP = buildBoldItalicMap();

function invert(m: Record<string, string>): Record<string, string> {
  const r: Record<string, string> = {};
  for (const k of Object.keys(m)) {
    r[m[k]!] = k;
  }
  return r;
}

export const REVERSE_BOLD_MAP = invert(BOLD_MAP);
export const REVERSE_ITALIC_MAP = invert(ITALIC_MAP);
export const REVERSE_BOLD_ITALIC_MAP = invert(BOLD_ITALIC_MAP);
