import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Used by Storybook only (the package itself builds via tsup). Aliases
// react-native to react-native-web so the cross-platform primitives render
// in the browser.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.jsx', '.js'],
  },
  optimizeDeps: {
    include: ['react-native-web'],
  },
});
