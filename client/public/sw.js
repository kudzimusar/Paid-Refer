const CACHE_NAME = "refer-v1";
const OFFLINE_URLS = [
  "/",
  "/login",
  "/register",
  "/dashboard",
  "/offline.html",
];

// Pre-cache critical routes on install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS))
  );
  self.skipWaiting();
});

// Network first, fall back to cache
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((res) => {
        // Cache successful responses
        if (res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
        }
        return res;
      })
      .catch(() =>
        caches.match(event.request).then(
          (cached) => cached || caches.match("/offline.html")
        )
      )
  );
});

// Background sync — queue failed API calls when offline
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-pending-actions") {
    event.waitUntil(syncPendingActions());
  }
});

async function syncPendingActions() {
  const db = await openIndexedDB();
  const pending = await db.getAll("pendingActions");

  for (const action of pending) {
    try {
      await fetch(action.url, {
        method: action.method,
        headers: action.headers,
        body: action.body,
      });
      await db.delete("pendingActions", action.id);
    } catch {
      // Still offline — leave in queue
    }
  }
}

// Simple IndexedDB helper
async function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("refer-offline", 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("pendingActions")) {
        db.createObjectStore("pendingActions", { keyPath: "id" });
      }
    };
    request.onsuccess = () => {
      const db = request.result;
      resolve({
        getAll: (store) => new Promise((res) => {
          const tx = db.transaction(store, "readonly");
          res(tx.objectStore(store).getAll());
        }),
        delete: (store, id) => new Promise((res) => {
          const tx = db.transaction(store, "readwrite");
          tx.objectStore(store).delete(id);
          tx.oncomplete = () => res();
        })
      });
    };
  });
}
