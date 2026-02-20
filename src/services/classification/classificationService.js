/**
 * Classification Service — NyayaSetu
 * Uses ONNX Runtime Web with a lightweight text classification approach.
 *
 * Since DistilBERT requires a proper ONNX model file, we implement
 * a keyword-based classification engine that's deterministic and fast (<10ms),
 * satisfying the <200ms latency requirement (PRD §3.2).
 *
 * For production, swap the classify() internals with an ONNX model inference
 * call when the model file is available.
 *
 * PRD §4.2: Emergency detection MUST NOT rely on LLM output.
 */

// Legal case categories with Indian law context
export const CASE_CATEGORIES = {
  PROPERTY: 'Property & Tenancy',
  FAMILY: 'Family & Matrimonial',
  CRIMINAL: 'Criminal & FIR',
  CONSUMER: 'Consumer Protection',
  LABOUR: 'Labour & Employment',
  CYBER: 'Cyber Crime',
  CONSTITUTIONAL: 'Constitutional Rights',
  CORPORATE: 'Corporate & Commercial',
  UNKNOWN: 'General Legal Query',
};

export const URGENCY_LEVELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

// Keyword maps for fast deterministic classification
const CATEGORY_KEYWORDS = {
  PROPERTY: [
    'property', 'land', 'plot', 'house', 'flat', 'apartment', 'tenant', 'landlord',
    'rent', 'eviction', 'lease', 'security deposit', 'tenancy', 'possession',
    'encroachment', 'builder', 'real estate', 'registry', 'mutation', 'khata',
  ],
  FAMILY: [
    'divorce', 'separation', 'custody', 'child', 'alimony', 'maintenance', 'marriage',
    'domestic violence', 'dowry', 'husband', 'wife', 'spouse', 'matrimonial',
    'adoption', 'inheritance', 'succession', 'will', 'family court',
  ],
  CRIMINAL: [
    'fir', 'police', 'arrest', 'accused', 'bail', 'crime', 'criminal', 'theft',
    'murder', 'assault', 'fraud', 'cheating', 'ipc', 'crpc', 'complaint', 'chargesheet',
    'prison', 'jail', 'custody', 'magistrate', 'sessions court',
  ],
  CONSUMER: [
    'consumer', 'refund', 'defective', 'product', 'service', 'complaint',
    'amazon', 'flipkart', 'online', 'purchase', 'delivery', 'seller',
    'hospital', 'medical negligence', 'insurance', 'claim', 'forum',
  ],
  LABOUR: [
    'job', 'employment', 'employer', 'employee', 'salary', 'wage', 'fired',
    'termination', 'retrenchment', 'layoff', 'pf', 'provident fund', 'esi',
    'gratuity', 'leave', 'workplace', 'harassment', 'labour', 'labor',
  ],
  CYBER: [
    'cyber', 'online fraud', 'hacking', 'phishing', 'identity theft', 'scam',
    'social media', 'defamation', 'data', 'privacy', 'it act', 'digital',
    'email', 'password', 'account hacked', 'deepfake', 'revenge porn',
  ],
  CONSTITUTIONAL: [
    'fundamental rights', 'pil', 'constitution', 'article 21', 'right to',
    'discrimination', 'freedom', 'equality', 'petition', 'high court', 'supreme court',
    'government', 'public interest', 'voting rights', 'reservation',
  ],
  CORPORATE: [
    'business', 'company', 'partnership', 'contract', 'agreement', 'shareholder',
    'director', 'incorporation', 'startup', 'mca', 'gst', 'tax', 'trademark',
    'copyright', 'intellectual property', 'nda', 'mou',
  ],
};

// Emergency keywords that trigger immediate emergency screen
const EMERGENCY_KEYWORDS = [
  'kidnapped', 'kidnapping', 'abducted', 'abduction',
  'being forced', 'threatened with death', 'kill me', 'kill her', 'kill him',
  'holding me captive', 'trapped', 'suicide', 'life in danger',
  'acid attack', 'rape', 'sexual assault', 'being attacked right now',
  'domestic violence happening now', 'beating me', 'hitting me now',
  'immediate danger', 'help me now', 'emergency',
];

// High urgency signals
const HIGH_URGENCY_KEYWORDS = [
  'urgent', 'immediately', 'today', 'tonight', 'tomorrow', 'deadline',
  'evicted', 'arrested', 'bail', 'hearing', 'court date', 'notice received',
  'police station', 'being harassed', 'threatening', 'violence',
  'fired today', 'terminated', 'hospital', 'accident',
];

class ClassificationService {
  constructor() {
    this.initialized = false;
  }

  /** Initialize the service. In production, loads ONNX model here. */
  async initialize() {
    // Future: Load DistilBERT ONNX model via ort.InferenceSession.create()
    // For now, keyword-based engine is ready immediately
    this.initialized = true;
    console.log('[ClassificationService] Initialized (keyword engine).');
  }

  /**
   * Classify a legal issue text into a category.
   * @param {string} text
   * @returns {{ category: string, label: string, confidence: number, allScores: Object }}
   */
  classifyCase(text) {
    const lowerText = text.toLowerCase();
    const scores = {};

    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      const matchCount = keywords.filter(kw => lowerText.includes(kw)).length;
      scores[category] = matchCount;
    }

    const topCategory = Object.entries(scores).reduce(
      (best, [cat, score]) => score > best.score ? { cat, score } : best,
      { cat: 'UNKNOWN', score: 0 }
    );

    const totalMatches = Object.values(scores).reduce((a, b) => a + b, 0);
    const confidence = totalMatches > 0
      ? Math.min(0.95, topCategory.score / Math.max(1, totalMatches))
      : 0;

    return {
      category: topCategory.cat,
      label: CASE_CATEGORIES[topCategory.cat] ?? CASE_CATEGORIES.UNKNOWN,
      confidence: Math.max(confidence, 0.6), // Minimum displayed confidence
      allScores: scores,
    };
  }

  /**
   * Detect urgency level from text.
   * @param {string} text
   * @returns {{ level: string, confidence: number }}
   */
  detectUrgency(text) {
    const lowerText = text.toLowerCase();

    const highMatches = HIGH_URGENCY_KEYWORDS.filter(kw => lowerText.includes(kw)).length;

    if (highMatches >= 2) {
      return { level: URGENCY_LEVELS.HIGH, confidence: 0.9 };
    } else if (highMatches === 1) {
      return { level: URGENCY_LEVELS.MEDIUM, confidence: 0.75 };
    }
    return { level: URGENCY_LEVELS.LOW, confidence: 0.7 };
  }

  /**
   * Check if text indicates an emergency requiring immediate help.
   * PRD §4.2: MUST NOT rely on LLM — this is standalone fast detection.
   * @param {string} text
   * @returns {{ isEmergency: boolean, confidence: number, trigger: string|null }}
   */
  checkEmergency(text) {
    const lowerText = text.toLowerCase();

    for (const keyword of EMERGENCY_KEYWORDS) {
      if (lowerText.includes(keyword)) {
        return {
          isEmergency: true,
          confidence: 0.95,
          trigger: keyword,
        };
      }
    }

    return { isEmergency: false, confidence: 0.9, trigger: null };
  }

  /**
   * Full triage: classify + urgency + emergency in one call.
   * @param {string} text
   * @returns {{ classification, urgency, emergency }}
   */
  analyze(text) {
    const emergency = this.checkEmergency(text);
    // If emergency, skip expensive classification
    if (emergency.isEmergency) {
      return {
        classification: { category: 'CRIMINAL', label: CASE_CATEGORIES.CRIMINAL, confidence: 0.9 },
        urgency: { level: URGENCY_LEVELS.HIGH, confidence: 0.99 },
        emergency,
      };
    }

    const classification = this.classifyCase(text);
    const urgency = this.detectUrgency(text);

    return { classification, urgency, emergency };
  }
}

export const classificationService = new ClassificationService();
export default classificationService;
