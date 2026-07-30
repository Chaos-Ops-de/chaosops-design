/**
 * Asset re-exports. Each app resolves paths through its own bundler:
 *
 * Web (Vite):
 *   import logo from '@chaos-ops-de/design/assets/logo.png';
 *   import sleep from '@chaos-ops-de/design/assets/gremlins/sleep.png';
 *
 * Native (Metro):
 *   const logo  = require('@chaos-ops-de/design/assets/logo.png');
 *   const sleep = require('@chaos-ops-de/design/assets/gremlins/sleep.png');
 *
 * The `./assets/*` subpath is exposed via package.json exports.
 */
export const gremlinNames = [
  '404', 'buy', 'down', 'erfolg', 'hide',
  'loadingbar', 'login', 'mail', 'maintance', 'sleep',
] as const;

export type GremlinName = (typeof gremlinNames)[number];
