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
`Text`, `Gremlin` + `gremlinCss`, `FlipchartBackground`.

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
