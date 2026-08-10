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
    // .web.js/.web.jsx matter for packages that ship a prebuilt web variant
    // (e.g. react-native-safe-area-context's lib/module/*.web.js) rather
    // than a .web.tsx/.web.ts source file resolved through our own build.
    extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js'],
  },
  optimizeDeps: {
    include: ['react-native-web'],
    // `resolve.extensions` above only governs Vite's own resolver — the
    // dev server's esbuild-based dependency pre-bundler has its own,
    // separate extension list and doesn't inherit it. Without this,
    // `vite dev` resolves packages' plain (non-.web) entry files even
    // when a .web.js variant exists, which breaks for any RN library that
    // ships native-only Fabric codegen specs in its default entry (e.g.
    // react-native-safe-area-context) — `vite build` doesn't hit this
    // because Rollup uses Vite's resolver, not esbuild's.
    esbuildOptions: {
      resolveExtensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js'],
    },
  },
});
