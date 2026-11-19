/**
 * Stacking scale. The values keep the relative order the package already
 * relied on (select < sticky chrome < widget < fab < drawer < modal < popover < toast <
 * tooltip) and stay in the same range, so existing consumers that sit between
 * these layers keep working. Use the `--chaos-z-*` CSS vars; never a literal.
 */
export const zIndex = {
  /** Lifted above its siblings inside one component (focus ring, sliding underline). */
  raised: 1,
  /** In-flow popups that sit just above content (dropdown lists). */
  dropdown: 50,
  /** Sticky headers and navigation bars. */
  sticky: 100,
  /** Floating widgets that sit over sticky chrome but under overlays (the clock). */
  widget: 120,
  /** Floating action chrome (theme toggle, chat launcher). */
  fab: 1000,
  /** Side drawers — below a modal opened from inside them. */
  drawer: 9990,
  /** Modals and sheets. */
  modal: 9999,
  /** Menus and popovers — must open above a modal that contains their trigger. */
  popover: 10000,
  /** Toasts — above everything the user is working in. */
  toast: 10001,
  /** Tooltips — topmost. */
  tooltip: 10002,
} as const;

export type ZIndexKey = keyof typeof zIndex;
