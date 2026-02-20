/**
 * Crypto Service — NyayaSetu
 * AES-GCM 256-bit encryption via Web Crypto API.
 * Per-session key generation. No plaintext ever stored.
 * Satisfies PRD §4.4 and §7.
 */

class CryptoService {
  constructor() {
    // Session key, generated once per app session
    this._sessionKey = null;
  }

  /**
   * Generate a random AES-GCM 256-bit key for this session.
   * @returns {Promise<CryptoKey>}
   */
  async generateSessionKey() {
    this._sessionKey = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    return this._sessionKey;
  }

  /**
   * Get (or lazily create) the current session key.
   * @returns {Promise<CryptoKey>}
   */
  async getSessionKey() {
    if (!this._sessionKey) {
      await this.generateSessionKey();
    }
    return this._sessionKey;
  }

  /**
   * Encrypt a plaintext string using AES-GCM.
   * @param {string} plaintext
   * @param {CryptoKey} [key] — uses session key if not provided
   * @returns {Promise<{ ciphertext: ArrayBuffer, iv: Uint8Array }>}
   */
  async encrypt(plaintext, key) {
    const encKey = key ?? await this.getSessionKey();
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV
    const encoded = new TextEncoder().encode(plaintext);

    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      encKey,
      encoded
    );

    return { ciphertext, iv };
  }

  /**
   * Decrypt an AES-GCM ciphertext.
   * @param {ArrayBuffer} ciphertext
   * @param {Uint8Array} iv
   * @param {CryptoKey} [key] — uses session key if not provided
   * @returns {Promise<string>}
   */
  async decrypt(ciphertext, iv, key) {
    const encKey = key ?? await this.getSessionKey();

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      encKey,
      ciphertext
    );

    return new TextDecoder().decode(decrypted);
  }

  /**
   * Serialize an encrypted payload to a storable format.
   * Converts ArrayBuffer / Uint8Array to base64 strings.
   * @param {{ ciphertext: ArrayBuffer, iv: Uint8Array }} payload
   * @returns {{ ciphertext: string, iv: string }}
   */
  serializePayload({ ciphertext, iv }) {
    return {
      ciphertext: this._ab2b64(ciphertext),
      iv: this._ab2b64(iv.buffer),
    };
  }

  /**
   * Deserialize a stored payload back to ArrayBuffer/Uint8Array.
   * @param {{ ciphertext: string, iv: string }} stored
   * @returns {{ ciphertext: ArrayBuffer, iv: Uint8Array }}
   */
  deserializePayload({ ciphertext, iv }) {
    return {
      ciphertext: this._b642ab(ciphertext),
      iv: new Uint8Array(this._b642ab(iv)),
    };
  }

  /**
   * Encrypt a message object and return a storable serialized payload.
   */
  async encryptMessage(messageObj) {
    const plaintext = JSON.stringify(messageObj);
    const payload = await this.encrypt(plaintext);
    return this.serializePayload(payload);
  }

  /**
   * Decrypt a stored serialized payload back to message object.
   */
  async decryptMessage(serialized) {
    const { ciphertext, iv } = this.deserializePayload(serialized);
    const plaintext = await this.decrypt(ciphertext, iv);
    return JSON.parse(plaintext);
  }

  // --- Private helpers ---
  _ab2b64(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
  }

  _b642ab(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  /** Reset session key (e.g., on session end) */
  clearSession() {
    this._sessionKey = null;
  }
}

// Singleton
export const cryptoService = new CryptoService();
export default cryptoService;
