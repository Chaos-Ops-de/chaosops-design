import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'tokens/index': 'src/tokens/index.ts',
    'icons/web': 'src/icons/web.ts',
    'icons/native': 'src/icons/native.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-native', 'react-native-web', 'lucide-react', 'lucide-react-native'],
  splitting: false,
});
