import { useState, useEffect } from "react";

interface PendingAction {
  id: string;
  url: string;
  method: string;
  body: string;
  headers: Record<string, string>;
  createdAt: number;
}

export function useOfflineQueue() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const online = () => setIsOnline(true);
    const offline = () => setIsOnline(false);
    window.addEventListener("online", online);
    window.addEventListener("offline", offline);
    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    };
  }, []);

  async function queueOrFetch(url: string, options: RequestInit): Promise<Response | null> {
    if (isOnline) {
      return fetch(url, options);
    }

    // Store in IndexedDB for later sync
    const action: PendingAction = {
      id: crypto.randomUUID(),
      url,
      method: options.method || "GET",
      body: options.body as string,
      headers: (options.headers as Record<string, string>) || {},
      createdAt: Date.now(),
    };

    await storeInIndexedDB("pendingActions", action);

    // Register background sync
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const reg = await navigator.serviceWorker.ready;
      // @ts-ignore
      await reg.sync.register("sync-pending-actions");
    }

    return null;
  }

  return { isOnline, queueOrFetch };
}

async function storeInIndexedDB(storeName: string, data: any) {
  return new Promise<void>((resolve, reject) => {
    const request = indexedDB.open("refer-offline", 1);
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(storeName, "readwrite");
      tx.objectStore(storeName).add(data);
      tx.oncomplete = () => resolve();
    };
    request.onerror = () => reject(request.error);
  });
}
