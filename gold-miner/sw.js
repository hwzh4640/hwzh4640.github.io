/*
 * Gold Miner has moved to https://arcade.hz.ax/gold-miner/
 *
 * Browsers that visited the old address still run its service worker, which would keep serving
 * the saved copy of the game forever. This replacement removes that copy and itself, and sends
 * open pages to the new address.
 */
const MOVED_TO = 'https://arcade.hz.ax/gold-miner/';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const scope = self.registration.scope;
      // Cache names carry the scope, so the other games on this domain are left alone.
      const names = await caches.keys();
      await Promise.all(names.filter((n) => n.includes(scope)).map((n) => caches.delete(n)));
      await self.clients.claim();
      const pages = await self.clients.matchAll({ type: 'window' });
      await Promise.all(
        pages.map((page) => {
          const from = new URL(page.url);
          return page.navigate(MOVED_TO + from.search + from.hash).catch(() => undefined);
        }),
      );
      await self.registration.unregister();
    })(),
  );
});
