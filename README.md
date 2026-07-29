# @chaosops/design

Shared design system for **ChaosOps**. One source of truth for tokens,
theme, cross-platform primitives, icons, and mascot assets — consumed
by both `ChaosOps` (web) and `ChaosOps_Mobile_App`.

Primitives are written in **React Native** and run in the browser via
[`react-native-web`](https://necolas.github.io/react-native-web/). Both
apps look identical because they read the same tokens.

## Install

```bash
# .npmrc (in each consumer)
@chaosops:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}

# then
npm install @chaosops/design
```

Peer requirements: `react >= 18`. On native additionally `react-native`;
on web additionally `react-native-web` (`^0.19` or newer).

## What's inside

### Tokens (`@chaosops/design/tokens`)

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

### Primitives (`@chaosops/design`)

`PillButton`, `StickerCard`, `Chip`, `DashedDivider`, `ActionButton`,
`Text`, `Gremlin` + `gremlinCss`, `FlipchartBackground`.

### Icons (`@chaosops/design/icons`)

Re-exports `lucide-react` on web, `lucide-react-native` on native.

### Assets (`@chaosops/design/assets/*`)

- `assets/logo.png`
- `assets/gremlins/{404, buy, down, erfolg, hide, loadingbar, login, mail, maintance, sleep}.png`

## Usage — Web

```tsx
import { ThemeProvider, CssVariables, createLocalStorageAdapter } from '@chaosops/design';
import { PillButton, FlipchartBackground } from '@chaosops/design';

<ThemeProvider storage={createLocalStorageAdapter()}>
  <CssVariables />
  <FlipchartBackground>
    <PillButton label="Los geht's" onPress={() => alert('!')} />
  </FlipchartBackground>
</ThemeProvider>
```

Vite must alias `react-native` → `react-native-web`:

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
import { ThemeProvider, PillButton } from '@chaosops/design';

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
npm run build       # tsup → dist/
npm run typecheck   # tsc --noEmit
npm run test        # vitest run
```

## Releasing

Bump the version in `package.json`, commit, tag `vX.Y.Z`, push the tag.
The GitHub Actions workflow publishes to GitHub Packages on push of a
`v*` tag.
