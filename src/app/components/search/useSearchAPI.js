'use client';

import { performSearch as performAPISearch } from '@/app/services/api/search';

export const useSearchAPI = () => {
  const performSearch = async (searchQuery, searchType, lang, appLinks) => {
    try {
      if (searchType === 'system') {
        // Search app links locally
        const query = searchQuery.toLowerCase();
        return appLinks.filter(link => {
          const label = link.label[lang].toLowerCase();
          const category = link.category[lang].toLowerCase();
          const keywords = link.keywords[lang].map(k => k.toLowerCase());
          
          return (
            label.includes(query) ||
            category.includes(query) ||
            keywords.some(keyword => keyword.includes(query))
          );
        });
      }

      // Use API service for cases, parties, and clients
      return await performAPISearch(searchQuery, searchType);
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  };

  return { performSearch };
};
