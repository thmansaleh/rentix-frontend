'use client';

import { performSearch as performAPISearch } from '@/app/services/api/search';

/**
 * Score a single app link against the query.
 * Higher score = better match.
 *
 * Scoring tiers:
 *  100 – exact label match
 *   80 – label starts with query
 *   60 – label contains query
 *   40 – category starts with / contains query
 *   20 – any keyword starts with query
 *   10 – any keyword contains query
 *
 * A link is included only when its total score > 0.
 */
function scoreLink(link, query, lang) {
  const q = query.toLowerCase().trim();
  if (!q) return 0;

  const label    = link.label[lang].toLowerCase();
  const category = link.category[lang].toLowerCase();
  const keywords = link.keywords[lang].map(k => k.toLowerCase());

  let score = 0;

  // Label scoring
  if (label === q)           score += 100;
  else if (label.startsWith(q)) score += 80;
  else if (label.includes(q))   score += 60;

  // Category scoring
  if (category.startsWith(q)) score += 40;
  else if (category.includes(q)) score += 30;

  // Keyword scoring
  if (keywords.some(k => k === q))          score += 25;
  else if (keywords.some(k => k.startsWith(q))) score += 20;
  else if (keywords.some(k => k.includes(q)))   score += 10;

  // Fuzzy bonus: reward matches where all query chars appear in order in the label
  if (score === 0 && isFuzzyMatch(label, q)) score += 5;

  return score;
}

/** Returns true if every char in `query` appears in order inside `text`. */
function isFuzzyMatch(text, query) {
  let qi = 0;
  for (let i = 0; i < text.length && qi < query.length; i++) {
    if (text[i] === query[qi]) qi++;
  }
  return qi === query.length;
}

export const useSearchAPI = () => {
  const performSearch = async (searchQuery, searchType, lang, appLinks) => {
    try {
      if (searchType === 'system') {
        const scored = appLinks
          .map(link => ({ link, score: scoreLink(link, searchQuery, lang) }))
          .filter(({ score }) => score > 0)
          .sort((a, b) => b.score - a.score)
          .map(({ link }) => link);

        return scored;
      }

      // Use API service for clients and cars
      return await performAPISearch(searchQuery, searchType);
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  };

  return { performSearch };
};
