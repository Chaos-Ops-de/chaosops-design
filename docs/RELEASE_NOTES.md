# Release notes

Notes for the larger additive releases (0.12 and 0.15). Every release is published automatically, see the README.

## 0.12.0 notes

- New palette tokens (light + dark, exposed as `--chaos-*` CSS vars): `shadowColor`,
  `glowInfo`/`glowGreen`/`glowAmber`, `tapeHighlight`, `tapeShade`,
  `surfaceInverse`/`onInverse` (fixed dark chrome, does not flip),
  `amberLight`/`amberDark`, `infoLight`/`infoDark`, `dangerLight`/`dangerDark`
  (gradient pairs), `blueStrong` (#2563eb light / #3b82f6 dark), `hairline`.
- `Button`/`Input`/`FormField` are DOM components in `./web` (not RN), because
  they rely on `:focus-visible`, CSS glow and native `<input>` semantics.
  `Avatar` exists twice: DOM in `./web`, React Native/RNW in `./primitives`.
- `useFocusTrap` was already used internally by `Modal`/`Sheet`; it is now public.
- Everything is additive; no renames or removals.

## Unreleased (0.15) notes

Everything is additive — no renames or removals — and the sticker look (offset
ink shadows, Gloria Hallelujah headings, dashed dividers) is unchanged.

- **New tokens:** motion roles (`timings`, `staggers`, `springs`, `motionLimits`,
  `toastDurations`), layout (`touchTarget`, `rowHeights`, `breakpoints`, `gutters`,
  `gridSplits`), type roles (`typeScale`, `tabularNums*`) and `cssElevation`. New CSS
  vars: `--chaos-timing-*`, `--chaos-elevation-*`, `--chaos-touch-target`,
  `--chaos-row-*`, `--chaos-gutter-*`.
- **Contrast helpers** (`contrastRatio`, `meetsContrast`, …) and a test that records
  which brand color pairs miss WCAG (white labels on the info/green/danger/violet
  fills, the soft input border, `inkFaint`, the light focus ring). They are kept as
  brand choices; the list in `src/tokens/contrast.test.ts` is asserted exactly.
- **Toast:** default dismiss time per type (info/success 4 s, warning 7 s, error stays),
  pause on hover/focus, swipe to dismiss, close button when it won't auto-dismiss,
  `role="alert"` for errors, palette tokens instead of hex, `maxVisible` (default 3,
  rest queued), `top-center` on phones when no `position` is given, optional `action`.
  `ToastContainer` now renders one stack, so toasts no longer overlap.
- **Button:** `loading` keeps the width (label hidden, spinner overlaid; children are now
  wrapped in `.chaos-btn__content`/`__label`), `disabledReason`, 44 px minimum on touch,
  and the accent button's label stays dark in dark mode.
- **Input / FormField:** `valid` state, `reserveMessageSpace`, error icon, placeholder uses
  `inkMuted` (was `inkFaint`, which fails 4.5:1), autofill restyled to the field surface.
- **Select:** arrow/Home/End navigation, flips upward near the viewport bottom, search
  above 10 options (`searchable`), 120 ms open. The listbox now only contains options.
- **Sheet / Modal:** unique title ids (`useId`), 44 px close buttons, dialog labelled by title.
- **Native primitives (new):** `Badge`, `Spinner`, `ProgressBar`, `ToastProvider`/`useToast`,
  `EmptyState`, `PasswordInput`, `OtpInput`. The empty-state copy and the password/OTP/progress
  logic live in the root entry's utils so web and native share them.
- **Stacking scale:** `zIndex` tokens and `--chaos-z-*` vars (dropdown 50, sticky 100, widget 120, fab 1000,
  drawer 9990, modal 9999, popover 10000, toast 10001, tooltip 10002). The numbers match what the
  components already used, now referenced instead of repeated.
- **Icons are lucide only.** No emoji or glyph characters (check marks, arrows, triangles) anywhere
  in source, stories or docs; `LanguageRow`, `SearchBar`, `TimeRow`, `UnitStepper`, `WelcomeCard`,
  the Sentry boundary and the Clock widget now draw lucide icons. `src/noEmoji.test.ts` fails the
  build on any such character (arrows are allowed in comments and this README only).
- **Sketchbook:** theme and text-direction toolbar, phone/cards/table viewports, and
  Layout, Contrast and Motion-roles token pages.

