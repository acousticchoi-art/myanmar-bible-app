// Kyanza offline Bible storage. Uses IndexedDB so full-book text does not fill localStorage.
const DB_NAME = 'kyanza-offline-bible';
const STORE = 'books';
function database() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') { reject(new Error('Offline storage unavailable')); return; }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE, { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Unable to open offline storage'));
    request.onblocked = () => reject(new Error('Offline storage is blocked'));
  });
}
async function transaction(mode, action) {
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const request = action(tx.objectStore(STORE));
    let result;
    request.onsuccess = () => { result = request.result; };
    request.onerror = () => reject(request.error || new Error('Offline storage request failed'));
    tx.oncomplete = () => { db.close(); resolve(result); };
    tx.onabort = () => { db.close(); reject(tx.error || new Error('Offline storage write failed')); };
    tx.onerror = () => {};
  });
}
const key = (version, code) => version + ':' + code;
export async function readOfflineBible(version, code) {
  const entry = await transaction('readonly', store => store.get(key(version, code)));
  return entry?.data || null;
}
export async function saveOfflineBible(version, code, data) {
  if (!data?.chapters?.[1]?.length) throw new Error('Incomplete Bible data: ' + version + ':' + code);
  await transaction('readwrite', store => store.put({ id: key(version, code), data }));
}
export async function getSavedBibleCodes(version) {
  const ids = await transaction('readonly', store => store.getAllKeys());
  const prefix = version + ':';
  return new Set(ids.filter(id => String(id).startsWith(prefix)).map(id => String(id).slice(prefix.length)));
}

export const readBurmeseOffline = code => readOfflineBible('my', code);
export const saveBurmeseOffline = (code, data) => saveOfflineBible('my', code, data);
export const getSavedBurmeseCodes = () => getSavedBibleCodes('my');
