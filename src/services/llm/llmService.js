/**
 * LLM Service — NyayaSetu
 * Wraps the RunAnywhere Web SDK for on-device LLM inference.
 *
 * Correct API (verified from TypeScript definitions):
 *   1. RunAnywhere.initialize()
 *   2. RunAnywhere.registerModels([{ id, name, repo, files, framework: LLMFramework.LlamaCpp }])
 *   3. RunAnywhere.downloadModel(id)  — downloads to OPFS, emits 'model.downloadProgress' events
 *   4. RunAnywhere.loadModel(id)      — loads from OPFS into WASM memory
 *   5. TextGeneration.generate() / TextGeneration.generateStream()
 *
 * EventBus event: 'model.downloadProgress'
 * Event data shape: { modelId, stage, progress (0-1), bytesDownloaded, totalBytes }
 */
import { RunAnywhere, TextGeneration, EventBus, LLMFramework, ModelCategory } from '@runanywhere/web';

// Verified against CompactModelDef schema:
// { id, name, repo?, url?, files?, framework: LLMFramework, modality?: ModelCategory }
const MODELS = {
  primary: {
    id: 'lfm2-350m-q4_k_m',
    name: 'LFM2 350M (Q4_K_M)',
    repo: 'LiquidAI/LFM2-350M-GGUF',
    files: ['LFM2-350M-Q4_K_M.gguf'],
    framework: LLMFramework.LlamaCpp,
    modality: ModelCategory.Language,
    label: 'LFM2 350M · ~200MB',
  },
  fallback: {
    id: 'qwen-0.5b-instruct-q4',
    name: 'Qwen2.5 0.5B Instruct (Q4)',
    url: 'https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q4_0.gguf',
    framework: LLMFramework.LlamaCpp,
    modality: ModelCategory.Language,
    label: 'Qwen2.5 0.5B · ~400MB',
  },
};

const LEGAL_SYSTEM_PROMPT = `You are NyayaSetu AI, an Indian legal assistant. Help users understand their legal rights in India.

Rules:
1. Use simple language non-lawyers can understand.
2. Reference relevant Indian laws and acts where applicable.
3. Structure: Summary → Relevant Law → Suggested Steps → Disclaimer.
4. Keep under 350 words.
5. Always end with: "This is not legal advice. Please consult a licensed advocate."`;

class LLMService {
  constructor() {
    this.initialized = false;
    this.modelLoaded = false;
    this.loading = false;
    this.error = null;
    this._abortController = null;
    // Mutable pointer — updated when loadModel is called
    // so EventBus download events reach the current caller's UI
    this._progressCallback = null;
    this._busUnsubscribe = null;
  }

  /**
   * Initialize the RunAnywhere SDK and register models.
   * Subscribe to download progress via EventBus once.
   */
  async initialize() {
    if (this.initialized) return;

    await RunAnywhere.initialize({
      environment: import.meta.env.DEV ? 'development' : 'production',
      debug: import.meta.env.DEV,
    }, import.meta.env.BASE_URL + 'wasm/');

    // Register models with correct CompactModelDef shape
    RunAnywhere.registerModels([
      {
        id: MODELS.primary.id,
        name: MODELS.primary.name,
        repo: MODELS.primary.repo,
        files: MODELS.primary.files,
        framework: MODELS.primary.framework,
        modality: MODELS.primary.modality,
      },
      {
        id: MODELS.fallback.id,
        name: MODELS.fallback.name,
        url: MODELS.fallback.url,
        framework: MODELS.fallback.framework,
        modality: MODELS.fallback.modality,
      },
    ]);

    // Subscribe ONCE — routes to _progressCallback pointer
    this._busUnsubscribe = EventBus.shared.on('model.downloadProgress', (event) => {
      if (!event?.data) return;
      const { progress, bytesDownloaded, totalBytes } = event.data;
      if (progress == null) return;
      const mb = ((bytesDownloaded ?? 0) / 1024 / 1024).toFixed(1);
      const totalMb = ((totalBytes ?? 0) / 1024 / 1024).toFixed(0);
      const msg = totalMb > 0
        ? `Downloading: ${mb} MB / ${totalMb} MB`
        : `Downloading... ${Math.round(progress * 100)}%`;
      this._progressCallback?.(progress * 0.85, msg); // 0–85% = download phase
    });

    this.initialized = true;
    console.log('[LLMService] SDK initialized, models registered.');
  }

  /**
   * Download (if needed) and load model via RunAnywhere ModelManager.
   * @param {(progress: number, message: string) => void} onProgress
   */
  async loadModel(onProgress) {
    if (this.modelLoaded) { onProgress?.(1, 'Model already loaded.'); return; }
    if (this.loading) return;
    this.loading = true;

    // Point the shared callback so EventBus events reach this caller
    this._progressCallback = onProgress;

    const modelId = MODELS.primary.id;

    try {
      onProgress?.(0.05, `Checking cache for ${MODELS.primary.label}...`);

      // Check if already downloaded in a previous session
      const allModels = RunAnywhere.availableModels();
      const registered = allModels.find(m => m.id === modelId);
      const alreadyDownloaded = registered?.status === 'downloaded' || registered?.status === 'loaded';

      if (!alreadyDownloaded) {
        onProgress?.(0.1, `Downloading ${MODELS.primary.label}...`);
        // This fires EventBus 'model.downloadProgress' events during download
        await RunAnywhere.downloadModel(modelId);
      }

      onProgress?.(0.88, 'Loading model into WASM memory...');
      await RunAnywhere.loadModel(modelId);

      this.modelLoaded = true;
      this.loading = false;
      this._progressCallback = null;
      onProgress?.(1.0, `${MODELS.primary.label} ready.`);
      console.log('[LLMService] Model loaded:', modelId);
    } catch (primaryErr) {
      console.warn('[LLMService] Primary model failed:', primaryErr.message);

      try {
        const fbId = MODELS.fallback.id;
        onProgress?.(0.05, `Trying fallback: ${MODELS.fallback.label}...`);
        await RunAnywhere.downloadModel(fbId);
        onProgress?.(0.88, 'Loading fallback model...');
        await RunAnywhere.loadModel(fbId);
        this.modelLoaded = true;
        this.loading = false;
        this._progressCallback = null;
        onProgress?.(1.0, `${MODELS.fallback.label} ready.`);
      } catch (fallbackErr) {
        this.loading = false;
        this._progressCallback = null;
        this.error = fallbackErr;
        throw fallbackErr;
      }
    }
  }

  async generateTriageResponse(userInput, classification, onToken) {
    if (!this.modelLoaded) {
      throw new Error('Model not loaded. Download the AI model first using the status bar.');
    }

    const prompt = `User's Legal Issue: "${userInput}"
Classification: ${classification?.category ?? 'Unknown'}
Urgency Level: ${classification?.urgency ?? 'Medium'}

Please analyze this legal situation and provide structured guidance.`;

    this._abortController = new AbortController();

    const { stream, result } = await TextGeneration.generateStream(prompt, {
      systemPrompt: LEGAL_SYSTEM_PROMPT,
      maxTokens: 500,
      temperature: 0.3,
      topP: 0.9,
    });

    let fullText = '';
    for await (const token of stream) {
      fullText += token;
      onToken?.(token);
    }

    const finalResult = await result;
    return {
      text: fullText,
      tokensPerSecond: finalResult.tokensPerSecond,
      latencyMs: finalResult.latencyMs,
      modelUsed: finalResult.modelUsed,
    };
  }

  async generate(prompt, options = {}) {
    if (!this.modelLoaded) throw new Error('Model not loaded.');
    const result = await TextGeneration.generate(prompt, {
      systemPrompt: LEGAL_SYSTEM_PROMPT,
      maxTokens: 300,
      temperature: 0.2,
      ...options,
    });
    return result.text;
  }

  cancel() { this._abortController?.abort(); }

  getActiveModelLabel() { return MODELS.primary.label; }

  getStatus() {
    return {
      initialized: this.initialized,
      modelLoaded: this.modelLoaded,
      loading: this.loading,
      error: this.error,
      activeModel: MODELS.primary,
    };
  }
}

export const llmService = new LLMService();
export default llmService;
