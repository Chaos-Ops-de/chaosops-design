# chaosops-design

> Shared design system for all ChaosOps applications: tokens, theme, components and API contracts.

| | |
|---|---|
| **Type** | npm package (`@chaos-ops-de/design`), published to GitHub Packages |
| **Sketchbook** | [sketchbook.chaos-ops.de](https://sketchbook.chaos-ops.de) (Storybook, behind login) |
| **Visibility** | Public |
| **Default branch** | `main` |

## Overview

One source of truth for tokens, theme, cross-platform primitives, DOM components, icons and mascot assets. It is consumed by `chaosops-app`, `chaosops-landing`, `chaosops-mobile` and the `chaosops-os` kiosk shell, so all ChaosOps surfaces look the same. Primitives are written in React Native and run in the browser through `react-native-web`; they live under a separate `./primitives` entry point so web-only consumers never pull in the React Native module graph.

## Features

- **Tokens:** palettes (light and dark), typography, spacing, radii, shadows, motion, layout and z-index scales
- **Theme:** `ThemeProvider`, `useTheme`, and CSS variables (`--chaos-*`) for web
- **Primitives (`./primitives`):** React Native components such as `PillButton`, `StickerCard`, `Chip`, `AuthScreen`
- **Web components (`./web`):** DOM-only components such as `Modal`, `Toast`, `Select`, `Tabs`, `DataTable`, `CookieBanner`
- **Contracts (`./contracts`):** shared API domain types mirroring the backend
- **Icons and assets:** lucide re-exports, logo and gremlin mascots

The full list of exports is in [`docs/REFERENCE.md`](docs/REFERENCE.md).

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript |
| UI | React, React Native, `react-native-web`, plain CSS for DOM components |
| Motion | `motion` |
| Build | tsup (ESM and CJS with type declarations) |
| Documentation | Storybook ("Sketchbook") |
| Testing | Vitest |
| Package manager | pnpm |

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- A GitHub token with `read:packages` to install the package in a consumer

### Use in a consumer

```bash
# .npmrc in the consumer
@chaos-ops-de:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}

npm install @chaos-ops-de/design
```

Peer requirements: `react >= 18`; on native additionally `react-native`, on web additionally `react-native-web` when using `./primitives`. Usage examples for web and Expo are in [`docs/REFERENCE.md`](docs/REFERENCE.md).

### Develop the package

```bash
git clone git@github.com:Chaos-Ops-de/chaosops-design.git
cd chaosops-design
pnpm install
pnpm run storybook    # http://localhost:6007
```

## Scripts

| Script | Description |
|---|---|
| `pnpm run build` | Build to `dist/` with tsup |
| `pnpm run build:watch` | Rebuild on change |
| `pnpm run typecheck` | `tsc --noEmit` |
| `pnpm run test` | Vitest |
| `pnpm run storybook` / `build-storybook` | Run / build the Sketchbook |
| `pnpm run clean` | Remove `dist/` |

## Project Structure

```
chaosops-design/
  src/
    tokens/        design tokens
    theme/         ThemeProvider, CSS variables
    primitives/    React Native components
    web/           DOM components (one folder per component)
    contracts/     shared API types
    utils/ icons/ assets/
  docs/            reference, release notes, Sketchbook deployment
  tsup.config.ts   build config
```

## Testing

`pnpm run test` runs Vitest. Besides component and logic tests it includes guard tests: `src/noEmoji.test.ts` fails on emoji or glyph characters in source, stories and docs (icons are lucide only), and `src/tokens/contrast.test.ts` records which brand colour pairs miss WCAG contrast. CI runs typecheck, test and build.

## Deployment

**Package releases are automated.** Bump `version` in `package.json` and merge to `main`. The `release` workflow detects the change, runs typecheck, test and build, publishes to GitHub Packages, and creates the `vX.Y.Z` tag and GitHub release. A push without a version bump publishes nothing. To republish the current version, run the `release` workflow via `workflow_dispatch`.

**The Sketchbook** (Storybook) is built and deployed to [sketchbook.chaos-ops.de](https://sketchbook.chaos-ops.de) on every push to `main`. It tracks `main`, not tagged versions. Setup details are in [`docs/SKETCHBOOK.md`](docs/SKETCHBOOK.md).

## Documentation

- [`docs/REFERENCE.md`](docs/REFERENCE.md): exports and usage for web and Expo
- [`docs/RELEASE_NOTES.md`](docs/RELEASE_NOTES.md): notes for the 0.12 and 0.15 releases
- [`docs/SKETCHBOOK.md`](docs/SKETCHBOOK.md): Sketchbook deployment and one-time setup

## Related Repositories

| Repository | Role |
|---|---|
| [`chaosops-app`](https://github.com/Chaos-Ops-de/chaosops-app) | Web app and API |
| [`chaosops-mobile`](https://github.com/Chaos-Ops-de/chaosops-mobile) | Mobile app (iOS, Android) |
| [`chaosops-landing`](https://github.com/Chaos-Ops-de/chaosops-landing) | Landing and sales pages |
| `chaosops-design` (this repo) | Shared design system |
| [`chaosops-os`](https://github.com/Chaos-Ops-de/chaosops-os) | Kiosk appliance (Linux image) |

## Contributing

This is a proprietary, closed-source project. Contributions are by prior arrangement only: contact [Lu2aDev80](https://github.com/Lu2aDev80) before making changes, and do not open pull requests or issues without written approval.

## License

Proprietary. All rights reserved. Self-hosting, forking, redistribution, commercial use and modification are not permitted without written permission from the author. Viewing the source on GitHub does not grant any licence.

(c) 2024-2026 Lu2aDev80
