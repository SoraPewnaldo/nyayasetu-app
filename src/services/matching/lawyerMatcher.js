/**
 * Lawyer Matcher — NyayaSetu
 * Finds the most relevant lawyers for a user's legal issue.
 * Uses embedding-based cosine similarity, fully local.
 *
 * PRD §4.3: Match users with relevant lawyers. Matching must execute locally.
 */
import { embeddingService } from '../embeddings/embeddingService.js';
import { dbService, STORES } from '../storage/indexedDBService.js';
import { LAWYER_SEED_DATA } from '../storage/lawyerDatabase.js';

class LawyerMatcher {
  constructor() {
    this.initialized = false;
    this._lawyersWithEmbeddings = null;
  }

  /**
   * Initialize: seed lawyers into IndexedDB and pre-compute embeddings.
   */
  async initialize() {
    if (this.initialized) return;

    await embeddingService.initialize();

    // Check if lawyers are already seeded
    const count = await dbService.count(STORES.LAWYERS);

    if (count === 0) {
      console.log('[LawyerMatcher] Seeding lawyer database...');
      for (const lawyer of LAWYER_SEED_DATA) {
        await dbService.put(STORES.LAWYERS, {
          ...lawyer,
          // Serialize Float32Array as regular Array for IndexedDB compatibility
          embedding: Array.from(embeddingService.generateEmbedding(lawyer.specialtyText)),
        });
      }
    }

    // Load all lawyers with precomputed embeddings into memory
    const lawyers = await dbService.getAll(STORES.LAWYERS);
    this._lawyersWithEmbeddings = lawyers.map(l => ({
      ...l,
      embeddingVec: new Float32Array(l.embedding),
    }));

    this.initialized = true;
    console.log('[LawyerMatcher] Initialized with', this._lawyersWithEmbeddings.length, 'lawyers.');
  }

  /**
   * Find top-K matching lawyers for a user's issue description.
   * @param {string} userDescription
   * @param {number} topK - Number of results (default 5)
   * @param {{ legalAidOnly?: boolean, category?: string }} filters
   * @returns {Array<{ lawyer: Object, score: number, rank: number }>}
   */
  async findMatches(userDescription, topK = 5, filters = {}) {
    if (!this.initialized) await this.initialize();

    // Generate embedding for user's issue
    const queryVec = embeddingService.generateEmbedding(userDescription);

    // Apply pre-filters
    let candidates = this._lawyersWithEmbeddings;
    if (filters.legalAidOnly) {
      candidates = candidates.filter(l => l.isLegalAid);
    }
    if (filters.category) {
      candidates = candidates.filter(l =>
        l.categories.some(c => c.toLowerCase().includes(filters.category.toLowerCase()))
      );
    }

    // Rank by cosine similarity
    const ranked = embeddingService
      .rankBySimilarity(queryVec, candidates.map(l => l.embeddingVec))
      .slice(0, topK)
      .map((result, rank) => ({
        lawyer: candidates[result.index],
        score: result.score,
        rank: rank + 1,
      }));

    return ranked;
  }

  /**
   * Get a single lawyer by ID.
   * @param {number} id
   */
  async getLawyerById(id) {
    return dbService.get(STORES.LAWYERS, id);
  }

  /**
   * Get all lawyers from the database.
   */
  async getAllLawyers() {
    return dbService.getAll(STORES.LAWYERS);
  }
}

export const lawyerMatcher = new LawyerMatcher();
export default lawyerMatcher;
