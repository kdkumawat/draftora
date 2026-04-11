/** Save/restore scroll on a textarea across React commits + focus/selection updates. */
export function readTextareaScroll(el: HTMLTextAreaElement | null): {
  top: number;
  left: number;
} {
  return { top: el?.scrollTop ?? 0, left: el?.scrollLeft ?? 0 };
}

export function writeTextareaScroll(
  el: HTMLTextAreaElement | null,
  top: number,
  left: number,
): void {
  if (!el) return;
  el.scrollTop = top;
  el.scrollLeft = left;
}
