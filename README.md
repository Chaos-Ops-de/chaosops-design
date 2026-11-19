# @chaos-ops-de/design

Shared design system for **ChaosOps**. One source of truth for tokens,
theme, cross-platform primitives, icons, and mascot assets — consumed
by both `ChaosOps` (web) and `ChaosOps_Mobile_App`.

Primitives are written in **React Native** and run in the browser via
[`react-native-web`](https://necolas.github.io/react-native-web/), but
live under a separate `./primitives` entry point (see below) so that
pure-web consumers who only need tokens/theme never pull in the
React Native module graph. Both apps look identical because they read
the same tokens.

## Install

```bash
# .npmrc (in each consumer)
@chaos-ops-de:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}

# then
npm install @chaos-ops-de/design
```

Peer requirements: `react >= 18`. On native additionally `react-native`;
on web additionally `react-native-web` (`^0.19` or newer).

## What's inside

### Tokens (`@chaos-ops-de/design/tokens`)

- `palettes.light` / `palettes.dark` — full flipchart palette
- `fontFamilies`, `webFontStack`, `googleFontsHref`, `fontSizes`, `fontWeights`
- `spacing`, `radii`, `cssShadows`, `rnOffsetShadow`, `paletteShadow`
- `durations`, `easings`
- `timings` (feedback / dropdown / exit / enter / toggle / attention), `staggers`, `springs`,
  `motionLimits`, `toastDurations`, `toastDurationFor(type)`
- `touchTarget`, `rowHeights`, `breakpoints`, `gutters`, `gridSplits`, `gridCollapse`
- `typeScale`, `lineHeights`, `tabularNumsCss`, `tabularNumsNative`
- `cssElevation` (soft float/overlay shadows for floating chrome — sticker offsets stay the signature)
- `brandColors` (`cloudflare: '#F48120'`), `amberShades`, `presetColors`, `resolveColorToken`
- `SCHEDULE_ITEM_TYPES`, `getItemTypeColor(type, theme)`

### Theme

- `<ThemeProvider storage={…} systemScheme={…}>` — cross-platform
- `useTheme()`, `usePalette()`
- `<CssVariables />` (web-only) — writes `--chaos-*` variables onto `<html>`
- `renderCssVariables(theme)` — SSR helper
- `createLocalStorageAdapter()`, `memoryStorage`, `ThemeStorage` type

### Primitives (`@chaos-ops-de/design/primitives`)

React Native components — only import this entry from React Native /
`react-native-web` consumers (i.e. the mobile app). Web-only consumers
(e.g. the landing site) that just need tokens/theme should stick to the
root entry and never touch this one.

`PillButton`, `StickerCard`, `Chip`, `DashedDivider`, `ActionButton`,
`Text`, `Gremlin` + `gremlinCss`, `AuthScreen`, and (0.12) `Avatar`,
`ConfirmModal`, `PromptModal`, `Sheet` (bottom sheet). The modal/sheet
primitives are React Native `Modal`s with an optional `onHaptic` callback
(no Expo dependency) and `bottomInset` for safe-area padding.

### Web (`@chaos-ops-de/design/web`)

DOM-only React components (plain CSS/HTML, no `react-native-web`) — safe
for any web consumer, including ones that never touch `./primitives`.

`Modal` + `ConfirmModal`/`AlertModal`, `Sheet`, `Toast`/`ToastContainer`/
`useToast`, `Select`, `OrganisationCard`, `CookieBanner`,
`SentryErrorBoundary`, `HelpChat`, `IconPicker`, `LandingNav`,
`BackButton`, `Footer`, `FooterAdmin`, `Clock`, `Arrow22`,
`ChangelogEntries`, `NotFoundPage`, `UnsavedChangesPrompt`,
`ThemeToggleButton`, `ResponsiveContainer`, `FlipchartBackground`,
`useUnsavedChangesGuard`, and (0.12) `Avatar`, `Button`, `Input`/`Textarea`,
`FormField`, `CloudflareBadge`, `useFocusTrap`/`useScrollLock`, `useIsMobile`.
Unreleased (0.15): `Badge`, `Banner`, `Spinner`/`ProgressBar`, `Skeleton`/`SkeletonText`/
`SkeletonGroup` + `useDelayedLoading`, `Switch`, `Checkbox`, `RadioGroup`, `PasswordField`,
`OtpInput`/`ResendCode`, `CopyButton`, `EmptyState`, `Tooltip`, `Tabs`/`TabPanel`,
`Pagination`/`PaginationSummary`/`LoadMoreButton`, `Stepper`/`Wizard`/`useWizard`, `Drawer`,
`Menu`/`Popover`, `Accordion`, `DataTable`, `Dropzone`/`UploadList`, `DatePicker`/
`DateRangePicker`, `useBlurValidation`.

### Utils (root entry)

Platform-neutral helpers: `formatDate`, `formatDateTime`, `formatTime`,
`formatBytes`, `formatUptime`, `timeAgo`, `formatElapsed`, `formatDateInput`,
`isValidDate`, `parseTimeString`, `isTimeBetween`, `getMinutesDifference`,
`colorForUserId(id, palette?)`, `initialFor`, `AVATAR_COLORS`, and the WCAG helpers
`contrastRatio`, `meetsContrast`, `parseColor`, `contrastThresholds`. The theme
module also exports `useSystemScheme()` (SSR-safe OS/kiosk scheme).

### Contracts (`@chaos-ops-de/design/contracts`)

Shared API domain types (`User`, `Organisation`, `Event`, `DayPlan`,
`ScheduleItem`, `Display`, `Tag`, ...) mirroring the ChaosOps backend's
Prisma schema, so the web app and mobile app aren't hand-retyping the
same server contract independently. Plain TypeScript types, no runtime
code — safe to import from anywhere. 0.12 adds the roster, staff
(Control Center), moderation, backup, organisation/auth-response, brainstorm
room, shared-plan and handbook shapes; where the web and mobile hand-written
copies disagreed, the file header documents how they were reconciled.

### Icons (`@chaos-ops-de/design/icons`)

Re-exports `lucide-react` on web, `lucide-react-native` on native.

### Assets (`@chaos-ops-de/design/assets/*`)

- `assets/logo.png`
- `assets/gremlins/{404, buy, down, erfolg, hide, loadingbar, login, mail, maintance, sleep}.png`

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

## Usage — Web

Web consumers that only need tokens/theme (e.g. the landing site) import
from the root only, and never need `react-native-web` at all:

```tsx
import { ThemeProvider, CssVariables, createLocalStorageAdapter } from '@chaos-ops-de/design';

<ThemeProvider storage={createLocalStorageAdapter()}>
  <CssVariables />
  {children}
</ThemeProvider>
```

If a web consumer does need the React Native primitives rendered via
`react-native-web`, import them from `./primitives` and alias
`react-native` → `react-native-web` in that consumer's bundler config:

```tsx
import { PillButton, FlipchartBackground } from '@chaos-ops-de/design/primitives';
```

```ts
// vite.config.ts
resolve: {
  alias: { 'react-native': 'react-native-web' },
  extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.jsx', '.js'],
},
optimizeDeps: { include: ['react-native-web'] },
```

## Usage — Mobile (Expo)

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ThemeProvider } from '@chaos-ops-de/design';
import { PillButton } from '@chaos-ops-de/design/primitives';

<ThemeProvider storage={AsyncStorage} systemScheme={useColorScheme() ?? 'light'}>
  <PillButton
    label="Los geht's"
    onHaptic={() => Haptics.selectionAsync().catch(() => {})}
    onPress={() => {}}
  />
</ThemeProvider>
```

## Scripts

```bash
pnpm run build       # tsup → dist/
pnpm run typecheck   # tsc --noEmit
pnpm run test        # vitest run
pnpm run storybook   # storybook dev -p 6007
```

## Releasing

Releases are automated. Bump the version in `package.json` and merge to
`main` — the `release` workflow detects the version change, runs
typecheck/test/build, publishes to GitHub Packages, then creates the
`vX.Y.Z` tag and GitHub release for you.

No manual tagging or `pnpm publish` needed. To re-publish the current
version manually (e.g. after a failed run), trigger the `release`
workflow via `workflow_dispatch` in the Actions tab.

## Sketchbook (Storybook) deployment

Every push to `main` builds this repo's Storybook and deploys it to
**https://sketchbook.chaos-ops.de** — a live, always-current reference for
every token/primitive/web component in this package, gated behind the same
authelia login as `logs.chaos-ops.de` (it's a dev tool, not customer-facing).
This is independent of the npm package release above — the sketchbook
tracks `main`, not tagged versions.

`.github/workflows/deploy-sketchbook.yml` builds `Dockerfile` (which runs
`pnpm run build-storybook` and serves the static output via nginx), pushes
it to `ghcr.io/<owner>/chaosops-sketchbook`, then SSHes into the server and
runs `docker compose up -d` against `docker-compose.yml` in this repo.

**One-time setup this repo needs** (this is a separate GitHub repo from
`ChaosOps`, so none of this is inherited even though the values may be the
same):

- Repo secrets: `PROD_HOST`, `SERVER_USER`, `SSH_PRIVATE_KEY` (same server
  as the rest of the stack).
- Repo variable: `DEPLOY_DIR_SKETCHBOOK` — a directory on that server
  containing a copy of this repo's `docker-compose.yml` (nothing else is
  needed there; the sketchbook has no database/API dependency).
- DNS: an A/CNAME record for `sketchbook.chaos-ops.de` pointing at the same
  host as `chaos-ops.de`.
- Confirm `authelia-chaos@docker` is the correct Traefik middleware name on
  that host (copied from the `dozzle` service in `ChaosOps/docker-compose.yml`).

To deploy manually (e.g. after setup, or to force a rebuild), trigger
`Deploy Sketchbook` via `workflow_dispatch` in the Actions tab.
