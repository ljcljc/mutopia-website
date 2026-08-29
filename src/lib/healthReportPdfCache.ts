const DATABASE_NAME = "mutopia-health-reports";
const STORE_NAME = "pdfs";
const DATABASE_VERSION = 1;

export async function getHealthReportPdfCacheKey(
  url: string,
  authToken: string | null,
): Promise<string | null> {
  if (!authToken || !globalThis.crypto?.subtle) return null;

  const tokenBytes = new TextEncoder().encode(authToken);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", tokenBytes);
  const tokenFingerprint = Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");

  return `${url}:${tokenFingerprint}`;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getCachedHealthReportPdf(cacheKey: string): Promise<Blob | null> {
  if (typeof indexedDB === "undefined") return null;
  try {
    const database = await openDatabase();
    return await new Promise((resolve, reject) => {
      const request = database.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(cacheKey);
      request.onsuccess = () => resolve(request.result instanceof Blob ? request.result : null);
      request.onerror = () => reject(request.error);
    });
  } catch {
    return null;
  }
}

export async function cacheHealthReportPdf(cacheKey: string, blob: Blob): Promise<void> {
  if (typeof indexedDB === "undefined") return;
  try {
    const database = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const request = database.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).put(blob, cacheKey);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    // Cache failures must never block PDF viewing.
  }
}
