# Reference

What the package exports and how to use it from web and Expo consumers.

## Exports

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
`react-native` to `react-native-web` in that consumer's bundler config:

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

