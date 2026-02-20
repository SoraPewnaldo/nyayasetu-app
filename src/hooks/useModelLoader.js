/**
 * useModelLoader — NyayaSetu
 * Initializes fast services (classification, embeddings) automatically.
 * LLM model download is manual — exposed via downloadAndLoad().
 * Model status persists in localStorage so returning users see correct state.
 */
import { useState, useEffect, useCallback } from 'react';
import { llmService } from '../services/llm/llmService.js';
import { classificationService } from '../services/classification/classificationService.js';
import { embeddingService } from '../services/embeddings/embeddingService.js';

const MODEL_STATUS_KEY = 'nyayasetu_model_status';

function getPersistedStatus() {
  try { return localStorage.getItem(MODEL_STATUS_KEY) ?? 'not_downloaded'; } catch { return 'not_downloaded'; }
}
function persistStatus(status) {
  try { localStorage.setItem(MODEL_STATUS_KEY, status); } catch { /* ignore */ }
}

export function useModelLoader() {
  const [sdkReady, setSdkReady] = useState(false);
  const [modelStatus, setModelStatus] = useState(getPersistedStatus); // 'not_downloaded' | 'downloading' | 'loading' | 'ready' | 'error'
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  // Auto-init fast services on mount (no UI blocking, <100ms)
  useEffect(() => {
    const init = async () => {
      try {
        await classificationService.initialize();
        await embeddingService.initialize();
        await llmService.initialize();
        setSdkReady(true);
        setMessage('AI runtime ready.');

        // If previously downloaded, auto-load the model into memory
        if (getPersistedStatus() === 'ready') {
          setModelStatus('loading');
          setMessage('Loading model from cache...');
          try {
            await llmService.loadModel((p, msg) => { setProgress(p); setMessage(msg); });
            setModelStatus('ready');
            setMessage('Model ready.');
          } catch {
            // Model wasn't cached after all — reset status
            persistStatus('not_downloaded');
            setModelStatus('not_downloaded');
            setMessage('');
          }
        }
      } catch (err) {
        setError(err.message ?? 'SDK initialization failed.');
      }
    };
    init();
  }, []);

  /** Manually trigger model download + load */
  const downloadAndLoad = useCallback(async () => {
    if (modelStatus === 'downloading' || modelStatus === 'loading' || modelStatus === 'ready') return;
    setError(null);
    setModelStatus('downloading');
    setProgress(0);
    setMessage('Starting model download...');
    try {
      await llmService.loadModel((p, msg) => {
        setProgress(p);
        setMessage(msg);
        setModelStatus(p < 0.8 ? 'downloading' : 'loading');
      });
      setModelStatus('ready');
      persistStatus('ready');
      setMessage('Model ready for inference.');
    } catch (err) {
      setModelStatus('error');
      setError(err.message ?? 'Model download failed.');
      persistStatus('not_downloaded');
    }
  }, [modelStatus]);

  return {
    sdkReady,
    modelStatus,           // 'not_downloaded' | 'downloading' | 'loading' | 'ready' | 'error'
    isModelReady: modelStatus === 'ready',
    isModelDownloaded: modelStatus === 'ready',
    isProcessing: modelStatus === 'downloading' || modelStatus === 'loading',
    progress,
    message,
    error,
    downloadAndLoad,
  };
}
