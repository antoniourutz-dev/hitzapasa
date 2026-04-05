const CACHE_IZENA = "hitzapasa-cache-v19";
const OINARRIZKO_ARTXIBOAK = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-192.svg",
  "/icons/icon-512.svg",
];

self.addEventListener("install", (gertaera) => {
  gertaera.waitUntil(
    caches
      .open(CACHE_IZENA)
      .then((cachea) => cachea.addAll(OINARRIZKO_ARTXIBOAK))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (gertaera) => {
  gertaera.waitUntil(
    caches
      .keys()
      .then((gakoak) =>
        Promise.all(
          gakoak
            .filter((gakoa) => gakoa !== CACHE_IZENA)
            .map((gakoa) => caches.delete(gakoa)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (gertaera) => {
  if (gertaera.request.method !== "GET") {
    return;
  }

  if (gertaera.request.mode === "navigate") {
    gertaera.respondWith(
      fetch(gertaera.request)
        .then((sarekoErantzuna) => {
          const kopia = sarekoErantzuna.clone();
          caches.open(CACHE_IZENA).then((cachea) => cachea.put(gertaera.request, kopia));
          return sarekoErantzuna;
        })
        .catch(async () => {
          const cachekoOrriBera = await caches.match(gertaera.request);
          return cachekoOrriBera || caches.match("/index.html");
        }),
    );
    return;
  }

  gertaera.respondWith(
    caches.match(gertaera.request).then(async (cachekoErantzuna) => {
      if (cachekoErantzuna) {
        return cachekoErantzuna;
      }

      const sarekoErantzuna = await fetch(gertaera.request);

      if (
        sarekoErantzuna.ok &&
        new URL(gertaera.request.url).origin === self.location.origin
      ) {
        const kopia = sarekoErantzuna.clone();
        caches.open(CACHE_IZENA).then((cachea) => cachea.put(gertaera.request, kopia));
      }

      return sarekoErantzuna;
    }),
  );
});
