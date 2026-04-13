/** LinkedIn CDN “consumption” reaction icons (small, light theme) */
export const LI_REACTION_ICON_LIKE =
  "https://static.licdn.com/aero-v1/sc/h/8ekq8gho1ruaf8i7f86vd1ftt";
export const LI_REACTION_ICON_PRAISE =
  "https://static.licdn.com/aero-v1/sc/h/b1dl5jk88euc7e9ri50xy5qo8";
export const LI_REACTION_ICON_EMPATHY =
  "https://static.licdn.com/aero-v1/sc/h/cpho5fghnpme8epox8rdcds22";

export const LI_REACTION_STACK = [
  { src: LI_REACTION_ICON_LIKE, alt: "Like" },
  { src: LI_REACTION_ICON_PRAISE, alt: "Celebrate" },
  { src: LI_REACTION_ICON_EMPATHY, alt: "Love" },
] as const;
