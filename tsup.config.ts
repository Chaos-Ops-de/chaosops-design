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
  splitting: false,
});
