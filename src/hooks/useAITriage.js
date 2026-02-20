/**
 * useAITriage — NyayaSetu
 * Orchestrates the full triage flow:
 *   1. Emergency detection (instant, no LLM)
 *   2. Case classification + urgency
 *   3. LLM streaming response
 *
 * PRD §4.1, §4.2
 */
import { useState, useCallback } from 'react';
import { classificationService } from '../services/classification/classificationService.js';
import { llmService } from '../services/llm/llmService.js';
import { dbService, STORES } from '../services/storage/indexedDBService.js';
import { useModelStatus } from '../components/ModelLoaderProvider.jsx';

export function useAITriage() {
  const { isModelReady, isProcessing: modelLoading } = useModelStatus() ?? {};
  const [state, setState] = useState({
    status: 'idle', // 'idle' | 'classifying' | 'generating' | 'done' | 'emergency' | 'error'
    classification: null,
    urgency: null,
    emergency: null,
    streamingText: '',
    fullResponse: '',
    error: null,
    metrics: null,
  });

  /**
   * Run the full triage pipeline on user input.
   * @param {string} userInput
   * @returns {{ emergency: boolean }} — caller can navigate based on this
   */
  const runTriage = useCallback(async (userInput) => {
    if (!userInput.trim()) return;

    setState(s => ({ ...s, status: 'classifying', streamingText: '', fullResponse: '', error: null }));

    try {
      // Step 1: Emergency check (deterministic, <10ms, NO LLM)
      const { classification, urgency, emergency } = classificationService.analyze(userInput);

      if (emergency.isEmergency) {
        setState(s => ({
          ...s,
          status: 'emergency',
          emergency,
          classification,
          urgency,
        }));
        return { emergency: true };
      }

      setState(s => ({
        ...s,
        classification,
        urgency,
        emergency,
        status: 'generating',
      }));

      // Step 2: LLM streaming response — only if model is loaded
      if (!isModelReady) {
        // Model still loading from cache — provide classification-only result
        const msg = modelLoading
          ? 'AI model is loading from cache, please wait a moment and try again.'
          : 'AI model not downloaded. Use the status bar (bottom right) to download it.';
        setState(s => ({
          ...s,
          status: 'done',
          fullResponse: `${msg}\n\nYour case has been classified as: ${classification.label} (Urgency: ${urgency.level}).\nPlease download the AI model for detailed legal analysis.`,
        }));
        sessionStorage.setItem('triageResult', JSON.stringify({ classification, urgency, response: null }));
        return { emergency: false };
      }

      let fullText = '';

      const { text, tokensPerSecond, latencyMs, modelUsed } = await llmService.generateTriageResponse(
        userInput,
        { category: classification.label, urgency: urgency.level },
        (token) => {
          fullText += token;
          setState(s => ({ ...s, streamingText: fullText }));
        }
      );

      // Step 3: Persist result to IndexedDB
      await dbService.put(STORES.TRIAGE_RESULTS, {
        timestamp: Date.now(),
        userInput,
        classification,
        urgency,
        response: text,
      });

      setState(s => ({
        ...s,
        status: 'done',
        fullResponse: text,
        metrics: { tokensPerSecond, latencyMs, modelUsed },
      }));

      return { emergency: false };
    } catch (err) {
      console.error('[useAITriage] Error:', err);
      setState(s => ({
        ...s,
        status: 'error',
        error: err.message ?? 'Triage failed. Please try again.',
      }));
      return { emergency: false };
    }
  }, [isModelReady, modelLoading]);

  const reset = useCallback(() => {
    setState({
      status: 'idle',
      classification: null,
      urgency: null,
      emergency: null,
      streamingText: '',
      fullResponse: '',
      error: null,
      metrics: null,
    });
    llmService.cancel();
  }, []);

  return { ...state, runTriage, reset };
}
