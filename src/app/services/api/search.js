import { searchCases } from './cases';
import { searchParties } from './parties';

/**
 * Unified search service for different entity types
 */

export const performSearch = async (searchQuery, searchType) => {
  try {
    if (!searchQuery || searchQuery.trim().length === 0) {
      return [];
    }

    const trimmedQuery = searchQuery.trim();

    switch (searchType) {
      case 'cases': {
        const response = await searchCases(trimmedQuery);
        return response.success ? (response.data || []).slice(0, 10) : [];
      }

      case 'parties': {
        // Search for opponents (party_type = 'opponent')
        const response = await searchParties(trimmedQuery, 'opponent');
        return response.success ? (response.data || []).slice(0, 10) : [];
      }

      case 'clients': {
        // Search for clients (party_type = 'client')
        const response = await searchParties(trimmedQuery, 'client');
        return response.success ? (response.data || []).slice(0, 10) : [];
      }

      default:
        return [];
    }
  } catch (error) {
    console.error(`Search error for type ${searchType}:`, error);
    throw error;
  }
};

// Export individual search functions as well
export { searchCases, searchParties };
