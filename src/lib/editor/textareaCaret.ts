/**
 * Caret pixel position inside a textarea (viewport coordinates).
 * Based on the mirror-div approach (MIT, component/textarea-caret-position).
 */

const PROPERTIES = [
  "direction",
  "boxSizing",
  "width",
  "height",
  "overflowX",
  "overflowY",
  "borderTopWidth",
  "borderRightWidth",
  "borderBottomWidth",
  "borderLeftWidth",
  "borderStyle",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "fontStyle",
  "fontVariant",
  "fontWeight",
  "fontStretch",
  "fontSize",
  "fontSizeAdjust",
  "lineHeight",
  "fontFamily",
  "textAlign",
  "textTransform",
  "textIndent",
  "textDecoration",
  "letterSpacing",
  "wordSpacing",
  "tabSize",
  "MozTabSize",
] as const;

function getCaretCoordinates(
  element: HTMLTextAreaElement,
  position: number,
): { top: number; left: number; height: number } {
  const div = document.createElement("div");
  document.body.appendChild(div);

  const style = div.style;
  const computed = getComputedStyle(element);

  style.whiteSpace = "pre-wrap";
  style.wordWrap = "break-word";
  style.position = "absolute";
  style.visibility = "hidden";
  style.overflow = "hidden";

  for (const prop of PROPERTIES) {
    (style as unknown as Record<string, string>)[prop] = (
      computed as unknown as Record<string, string>
    )[prop];
  }

  style.width = `${element.clientWidth}px`;

  const isFirefox =
    typeof window !== "undefined" &&
    (window as unknown as { mozInnerScreenX?: number }).mozInnerScreenX != null;
  if (isFirefox) {
    if (element.scrollHeight > parseInt(computed.height || "0", 10)) {
      style.overflowY = "scroll";
    }
  } else {
    style.overflow = "hidden";
  }

  div.scrollTop = element.scrollTop;
  div.scrollLeft = element.scrollLeft;

  div.textContent = element.value.substring(0, position);
  const span = document.createElement("span");
  span.textContent = element.value.substring(position) || ".";
  div.appendChild(span);

  const coordinates = {
    top: span.offsetTop + parseInt(computed.borderTopWidth || "0", 10),
    left: span.offsetLeft + parseInt(computed.borderLeftWidth || "0", 10),
    height: parseInt(computed.lineHeight || "0", 10) || 20,
  };

  document.body.removeChild(div);
  return coordinates;
}

/** Viewport (client) coordinates for `position: fixed` placement near the caret. */
export function getTextareaCaretClientPoint(
  element: HTMLTextAreaElement,
  position: number,
): { top: number; left: number; height: number } {
  const coordinates = getCaretCoordinates(element, position);
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + coordinates.top - element.scrollTop,
    left: rect.left + coordinates.left - element.scrollLeft,
    height: coordinates.height,
  };
}
