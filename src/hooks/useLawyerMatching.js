/**
 * useLawyerMatching — NyayaSetu
 * Finds matching lawyers via embedding-based cosine similarity.
 * PRD §4.3
 */
import { useState, useCallback, useEffect } from 'react';
import { lawyerMatcher } from '../services/matching/lawyerMatcher.js';

export function useLawyerMatching() {
  const [state, setState] = useState({
    status: 'idle', // 'idle' | 'initializing' | 'matching' | 'done' | 'error'
    matches: [],
    allLawyers: [],
    error: null,
  });

  // Initialize and load all lawyers on mount
  useEffect(() => {
    setState(s => ({ ...s, status: 'initializing' }));
    lawyerMatcher.initialize()
      .then(() => lawyerMatcher.getAllLawyers())
      .then(lawyers => {
        setState(s => ({ ...s, status: 'idle', allLawyers: lawyers }));
      })
      .catch(err => {
        setState(s => ({ ...s, status: 'error', error: err.message }));
      });
  }, []);

  /**
   * Find top matching lawyers for a legal issue description.
   * @param {string} userDescription
   * @param {number} topK
   * @param {Object} filters
   */
  const findMatches = useCallback(async (userDescription, topK = 5, filters = {}) => {
    setState(s => ({ ...s, status: 'matching' }));
    try {
      const matches = await lawyerMatcher.findMatches(userDescription, topK, filters);
      setState(s => ({ ...s, status: 'done', matches }));
      return matches;
    } catch (err) {
      setState(s => ({ ...s, status: 'error', error: err.message }));
      return [];
    }
  }, []);

  /**
   * Get a single lawyer by ID.
   */
  const getLawyer = useCallback(async (id) => {
    return lawyerMatcher.getLawyerById(+id);
  }, []);

  return {
    ...state,
    isLoading: state.status === 'initializing' || state.status === 'matching',
    findMatches,
    getLawyer,
  };
}
