export type DocSection = {
  id: string;
  title: string;
  keywords: string[];
  summary: string;
  body: string[];
};

export const DOC_SECTIONS: DocSection[] = [
  {
    id: "overview",
    title: "Overview",
    keywords: ["start", "introduction", "what", "draftora"],
    summary:
      "Draftora is a browser-based editor for LinkedIn posts using plain Unicode-no rich-text paste required.",
    body: [
      "Everything runs in your browser. Formatting uses mathematical Unicode characters so copied text stays bold or italic when pasted into LinkedIn’s post box.",
      "A live feed preview shows how your hook and body can look before you publish.",
      "Quick start: write in the editor, use the toolbar or keyboard shortcuts for styles, then Copy text and paste into LinkedIn’s composer. Your draft stays in the page until you refresh or clear it.",
    ],
  },
  {
    id: "unicode-formatting",
    title: "Unicode bold, italic, underline & strikethrough",
    keywords: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "format",
      "toolbar",
      "shortcut",
    ],
    summary:
      "Apply styles from the toolbar; they become Unicode characters that LinkedIn accepts as plain text.",
    body: [
      "Bold and italic map letters and digits to Unicode mathematical sans-serif ranges. Underline and strikethrough use combining characters after each glyph.",
      "Keyboard shortcuts: Bold ⌘/Ctrl+B, Italic ⌘/Ctrl+I, Underline ⌘/Ctrl+U, Strikethrough ⌘/Ctrl+Shift+X (⌘⇧X on Mac).",
      "Toggle again on the same selection to remove that style when the whole selection matches.",
    ],
  },
  {
    id: "paste-markdown",
    title: "Paste markdown-style text",
    keywords: ["paste", "markdown", "asterisk", "underscore", "tilde"],
    summary:
      "Pasting plain text that contains **bold**, *italic*, __bold__, _italic_, or ~~strike~~ converts those spans to Unicode.",
    body: [
      "Patterns are applied to the pasted fragment only. Order matters: ** and __ are processed before single * and _.",
      "After paste, the editor stores Unicode-not markdown markers-so the clipboard output matches what LinkedIn expects.",
    ],
  },
  {
    id: "mentions-hashtags",
    title: "@mentions and #hashtags",
    keywords: ["mention", "hashtag", "at", "tag"],
    summary:
      "Type @ to open suggestions; pick a name to insert a plain @Name token.",
    body: [
      "Hashtags are written as #word tokens. The tokenizer highlights them in the preview similar to LinkedIn.",
      "Mentions and hashtags are plain text-no HTML-so they survive copy/paste.",
    ],
  },
  {
    id: "links",
    title: "URLs and links",
    keywords: ["url", "link", "https", "http"],
    summary:
      "Insert full URLs (https recommended). The preview styles them as LinkedIn-style links.",
    body: [
      "Use the link button or paste a URL at the cursor. Detection follows your plain-text URL patterns in the parser.",
    ],
  },
  {
    id: "lists-indent",
    title: "Bullets, numbered lists, indent",
    keywords: ["bullet", "list", "numbered", "indent", "outdent"],
    summary:
      "Toggle bullets or 1. 2. 3. lists per line or across a selection; indent adds leading spaces per line.",
    body: [
      "Press Enter at the end of a numbered line to continue the sequence where supported.",
    ],
  },
  {
    id: "feed-preview",
    title: "Feed preview (hook & body)",
    keywords: ["preview", "feed", "hook", "see more", "mobile", "desktop"],
    summary:
      "See a mock card with hook teaser, “see more”, and body-switch Mobile/Desktop width.",
    body: [
      "The fold follows Draftora’s see-more logic so you can tune length before posting on LinkedIn.",
      "Use the Mobile / Desktop toggle to approximate how much of your hook shows in a narrow feed vs. wider layout.",
      "Hook vs. body split matches how LinkedIn can show a teaser before “see more”.",
    ],
  },
  {
    id: "templates-undo",
    title: "Templates, undo & redo",
    keywords: ["template", "undo", "redo", "history"],
    summary:
      "Open Templates from the header to start from a sample. Undo/redo cover typing and toolbar edits.",
    body: [
      "Undo ⌘/Ctrl+Z, Redo ⌘/Ctrl+Shift+Z on Mac or Ctrl+Y on Windows where configured.",
    ],
  },
  {
    id: "emoji-beautify",
    title: "Emoji, beautify & clear formatting",
    keywords: ["emoji", "beautify", "clear", "eraser"],
    summary:
      "Insert emoji from the picker; Beautify trims lines and normalizes spacing; Clear removes Unicode styling in the selection.",
    body: [
      "Emoji inserts at the cursor via the toolbar picker (positioned near the format bar).",
      "Beautify cleans line breaks and spacing-useful before copying a long draft.",
      "Clear formatting strips Unicode bold/italic and combining underline/strike in the current selection only.",
    ],
  },
  {
    id: "limits-copy",
    title: "Character limit & copy",
    keywords: ["3000", "limit", "copy", "clipboard"],
    summary:
      "Posts are capped at 3,000 characters with a warning band before the limit.",
    body: [
      "Copy text sends the full plain string-including Unicode-to your clipboard for pasting into LinkedIn.",
    ],
  },
  {
    id: "offline",
    title: "Offline use",
    keywords: ["offline", "pwa", "service worker", "cache"],
    summary:
      "After the first visit, a service worker caches the app shell so the editor can load without a network.",
    body: [
      "You need connectivity for first load and for external assets (e.g. fonts). Cached pages open offline; saving to cloud is not part of Draftora-your draft stays in the page until you copy it.",
      "Offline support is best-effort: use Copy text while online if you need to guarantee the latest draft is elsewhere.",
    ],
  },
];
