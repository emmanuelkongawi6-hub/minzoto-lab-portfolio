/* MINZOTO Lab : le site et l'administration s'ouvrent comme une application.
   Toujours la version la plus récente en priorité ; la copie enregistrée ne sert que sans connexion. */
const CACHE = "minzoto-app-v1";
const SHELL = ["/", "/index.html", "/administration/", "/icons/icon-192.png", "/icons/icon-512.png", "/icons/site.webmanifest", "/icons/admin.webmanifest"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(SHELL.map(u => c.add(u)))));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin) return;
  e.respondWith(
    fetch(r, { cache: "no-cache" })
      .then(res => { if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(r, copy)).catch(() => {}); } return res; })
      .catch(() => caches.match(r).then(m => m || caches.match(u.pathname.indexOf("/administration") === 0 ? "/administration/" : "/")))
  );
});
