/**
 * IndexedDB Service — NyayaSetu
 * Handles all local persistent storage: chat, triage results, config.
 * Models are cached via the RunAnywhere SDK in OPFS natively.
 */

const DB_NAME = 'nyayasetu-db';
const DB_VERSION = 1;

const STORES = {
  CHAT_HISTORY: 'chatHistory',
  TRIAGE_RESULTS: 'triageResults',
  LAWYERS: 'lawyers',
  APP_CONFIG: 'appConfig',
};

class IndexedDBService {
  constructor() {
    this.db = null;
  }

  async open() {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Encrypted chat sessions
        if (!db.objectStoreNames.contains(STORES.CHAT_HISTORY)) {
          const chatStore = db.createObjectStore(STORES.CHAT_HISTORY, { keyPath: 'sessionId' });
          chatStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Triage classification results
        if (!db.objectStoreNames.contains(STORES.TRIAGE_RESULTS)) {
          const triageStore = db.createObjectStore(STORES.TRIAGE_RESULTS, { keyPath: 'id', autoIncrement: true });
          triageStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Lawyer profiles + embeddings
        if (!db.objectStoreNames.contains(STORES.LAWYERS)) {
          const lawyerStore = db.createObjectStore(STORES.LAWYERS, { keyPath: 'id' });
          lawyerStore.createIndex('category', 'category', { unique: false });
          lawyerStore.createIndex('location', 'location', { unique: false });
        }

        // App settings
        if (!db.objectStoreNames.contains(STORES.APP_CONFIG)) {
          db.createObjectStore(STORES.APP_CONFIG, { keyPath: 'key' });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error('[IndexedDB] Failed to open database:', event.target.error);
        reject(event.target.error);
      };
    });
  }

  async put(storeName, value) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.put(value);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async get(storeName, key) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result ?? null);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll(storeName) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName, key) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(storeName) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async count(storeName) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.count();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

// Singleton
export const dbService = new IndexedDBService();
export { STORES };
export default dbService;
