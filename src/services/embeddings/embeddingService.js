/**
 * Embedding Service — NyayaSetu
 * Generates sentence embeddings for lawyer matching via cosine similarity.
 *
 * Uses a pure JS TF-IDF + vocabulary approach as a drop-in deterministic
 * embedding (no model file required). For production quality, swap the
 * _embed() internals with onnxruntime-web + MiniLM ONNX model.
 *
 * PRD §3.3: MiniLM embeddings, cosine similarity in browser.
 * PRD §4.3: Lawyer matching must execute locally.
 */

// A fixed vocabulary built from legal + lawyer domain terms.
// In production this would be MiniLM's tokenizer vocabulary.
const LEGAL_VOCAB = [
  // Property
  'property', 'land', 'plot', 'house', 'flat', 'apartment', 'tenant', 'landlord',
  'rent', 'eviction', 'lease', 'deposit', 'tenancy', 'possession', 'encroachment',
  'builder', 'estate', 'registry', 'mutation',
  // Family
  'divorce', 'separation', 'custody', 'child', 'alimony', 'maintenance', 'marriage',
  'violence', 'dowry', 'husband', 'wife', 'spouse', 'matrimonial', 'adoption',
  'inheritance', 'succession', 'will',
  // Criminal
  'fir', 'police', 'arrest', 'bail', 'crime', 'criminal', 'theft', 'murder',
  'assault', 'fraud', 'cheating', 'complaint', 'chargesheet', 'prison', 'custody',
  // Consumer
  'consumer', 'refund', 'defective', 'product', 'service', 'delivery', 'seller',
  'hospital', 'negligence', 'insurance', 'claim', 'forum',
  // Labour
  'job', 'employment', 'employer', 'employee', 'salary', 'wage', 'fired',
  'termination', 'retrenchment', 'layoff', 'provident', 'gratuity', 'leave',
  'workplace', 'harassment', 'labour', 'labor',
  // Cyber
  'cyber', 'hacking', 'phishing', 'identity', 'theft', 'scam', 'social', 'media',
  'defamation', 'data', 'privacy', 'digital', 'password', 'account',
  // Constitutional
  'fundamental', 'rights', 'pil', 'constitution', 'article', 'discrimination',
  'freedom', 'equality', 'petition', 'government', 'reservation',
  // Corporate
  'business', 'company', 'partnership', 'contract', 'agreement', 'shareholder',
  'director', 'startup', 'trademark', 'copyright', 'intellectual', 'nda',
];

const VOCAB_SIZE = LEGAL_VOCAB.length;
const VOCAB_INDEX = Object.fromEntries(LEGAL_VOCAB.map((w, i) => [w, i]));

class EmbeddingService {
  constructor() {
    this.initialized = false;
  }

  async initialize() {
    // Future: Load MiniLM ONNX model with ort.InferenceSession.create()
    // const session = await ort.InferenceSession.create('/models/minilm.onnx');
    this.initialized = true;
    console.log('[EmbeddingService] Initialized (TF-IDF engine).');
  }

  /**
   * Generate an embedding vector for a text string.
   * Returns a Float32Array of length VOCAB_SIZE.
   * @param {string} text
   * @returns {Float32Array}
   */
  generateEmbedding(text) {
    const lowerText = text.toLowerCase();
    const words = lowerText.split(/\s+/);
    const vector = new Float32Array(VOCAB_SIZE);

    // Term Frequency
    for (const word of words) {
      const idx = VOCAB_INDEX[word];
      if (idx !== undefined) {
        vector[idx] += 1;
      }
    }

    // L2 normalize
    return this._normalize(vector);
  }

  /**
   * Generate embeddings for multiple texts.
   * @param {string[]} texts
   * @returns {Float32Array[]}
   */
  generateBatchEmbeddings(texts) {
    return texts.map(t => this.generateEmbedding(t));
  }

  /**
   * Compute cosine similarity between two normalized vectors.
   * @param {Float32Array} a
   * @param {Float32Array} b
   * @returns {number} 0 to 1
   */
  cosineSimilarity(a, b) {
    let dot = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
    }
    // Vectors are already L2-normalized, so no need to divide by magnitudes
    return Math.max(0, Math.min(1, dot));
  }

  /**
   * Rank a set of candidate embeddings by similarity to a query embedding.
   * @param {Float32Array} queryVec
   * @param {Float32Array[]} candidateVecs
   * @returns {Array<{ index: number, score: number }>} Sorted descending.
   */
  rankBySimilarity(queryVec, candidateVecs) {
    return candidateVecs
      .map((vec, index) => ({ index, score: this.cosineSimilarity(queryVec, vec) }))
      .sort((a, b) => b.score - a.score);
  }

  // L2 normalization
  _normalize(vector) {
    let magnitude = 0;
    for (let i = 0; i < vector.length; i++) {
      magnitude += vector[i] * vector[i];
    }
    magnitude = Math.sqrt(magnitude);
    if (magnitude === 0) return vector;
    const normalized = new Float32Array(vector.length);
    for (let i = 0; i < vector.length; i++) {
      normalized[i] = vector[i] / magnitude;
    }
    return normalized;
  }
}

export const embeddingService = new EmbeddingService();
export default embeddingService;
