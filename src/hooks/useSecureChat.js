/**
 * useSecureChat — NyayaSetu
 * Encrypted local chat session.
 * All messages are encrypted with AES-GCM before storage.
 * PRD §4.4: Local-only, AES-GCM, no plaintext storage, session-based keys.
 */
import { useState, useCallback, useEffect, useRef } from 'react';
import { cryptoService } from '../services/encryption/cryptoService.js';
import { dbService, STORES } from '../services/storage/indexedDBService.js';

export function useSecureChat(sessionId) {
  const [messages, setMessages] = useState([]);
  const [keyReady, setKeyReady] = useState(false);
  const sessionIdRef = useRef(sessionId ?? `session-${Date.now()}`);

  // Initialize session key and load existing encrypted messages
  useEffect(() => {
    const init = async () => {
      await cryptoService.generateSessionKey();
      setKeyReady(true);

      // Load and decrypt existing messages for this session
      const stored = await dbService.get(STORES.CHAT_HISTORY, sessionIdRef.current);
      if (stored?.encryptedMessages) {
        const decrypted = await Promise.all(
          stored.encryptedMessages.map(em => cryptoService.decryptMessage(em))
        );
        setMessages(decrypted);
      }
    };

    init().catch(err => console.error('[useSecureChat] Init failed:', err));

    // Clear session key on component unmount
    return () => cryptoService.clearSession();
  }, []);

  /**
   * Send a message — encrypts and persists to IndexedDB.
   * @param {string} text
   * @param {'user'|'lawyer'|'ai'} sender
   */
  const sendMessage = useCallback(async (text, sender = 'user') => {
    if (!keyReady || !text.trim()) return;

    const message = {
      id: Date.now(),
      sender,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);

    // Encrypt all messages and persist
    try {
      const encryptedMessages = await Promise.all(
        updatedMessages.map(m => cryptoService.encryptMessage(m))
      );

      await dbService.put(STORES.CHAT_HISTORY, {
        sessionId: sessionIdRef.current,
        timestamp: Date.now(),
        encryptedMessages,
      });
    } catch (err) {
      console.error('[useSecureChat] Failed to encrypt/save message:', err);
    }

    return message;
  }, [keyReady, messages]);

  /**
   * Clear the current session (delete encrypted history, reset key).
   */
  const clearSession = useCallback(async () => {
    await dbService.delete(STORES.CHAT_HISTORY, sessionIdRef.current);
    cryptoService.clearSession();
    setMessages([]);
    setKeyReady(false);
    await cryptoService.generateSessionKey();
    setKeyReady(true);
  }, []);

  return {
    messages,
    keyReady,
    sendMessage,
    clearSession,
    sessionId: sessionIdRef.current,
  };
}
