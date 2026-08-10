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
`Text`, `Gremlin` + `gremlinCss`, `AuthScreen`.

### Web (`@chaos-ops-de/design/web`)

DOM-only React components (plain CSS/HTML, no `react-native-web`) — safe
for any web consumer, including ones that never touch `./primitives`.

`Modal` + `ConfirmModal`/`AlertModal`, `Sheet`, `Toast`/`ToastContainer`/
`useToast`, `Select`, `OrganisationCard`, `CookieBanner`,
`SentryErrorBoundary`, `HelpChat`, `IconPicker`, `LandingNav`,
`BackButton`, `Footer`, `FooterAdmin`, `Clock`, `Arrow22`,
`ChangelogEntries`, `NotFoundPage`, `UnsavedChangesPrompt`,
`ThemeToggleButton`, `ResponsiveContainer`, `FlipchartBackground`,
`useUnsavedChangesGuard`.

### Contracts (`@chaos-ops-de/design/contracts`)

Shared API domain types (`User`, `Organisation`, `Event`, `DayPlan`,
`ScheduleItem`, `Display`, `Tag`, ...) mirroring the ChaosOps backend's
Prisma schema, so the web app and mobile app aren't hand-retyping the
same server contract independently. Plain TypeScript types, no runtime
code — safe to import from anywhere.

### Icons (`@chaos-ops-de/design/icons`)

Re-exports `lucide-react` on web, `lucide-react-native` on native.

### Assets (`@chaos-ops-de/design/assets/*`)

- `assets/logo.png`
- `assets/gremlins/{404, buy, down, erfolg, hide, loadingbar, login, mail, maintance, sleep}.png`

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
