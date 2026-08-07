import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'tokens/index': 'src/tokens/index.ts',
    'icons/web': 'src/icons/web.ts',
    'icons/native': 'src/icons/native.ts',
    'web/index': 'src/web/index.ts',
    'primitives/index': 'src/primitives/index.ts',
    'contracts/index': 'src/contracts/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: [
    'react', 'react-dom', 'react-native', 'react-native-web',
    'lucide-react', 'lucide-react-native',
    '@sentry/react', 'react-router-dom',
  ],
  // Must be true: index/theme and primitives/index both import the same
  // internal theme/ThemeContext module. With splitting disabled, esbuild
  // duplicates that module into each output bundle, producing two separate
  // React Context instances at runtime — useTheme() then throws "must be
  // used within ThemeProvider" even when the tree is nested correctly,
  // because a primitive's Provider and a consumer end up on different
  // Context objects. Splitting extracts shared internal modules into a
  // common chunk both entries import, so context identity is preserved.
  splitting: true,
});
