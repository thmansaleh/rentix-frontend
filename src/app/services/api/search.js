import { searchCases } from './cases';
import { searchParties } from './parties';
import { searchClientsAgreements } from './clientsAgreements';

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
        const response = await searchParties(trimmedQuery);
        return response.success ? (response.data || []).slice(0, 10) : [];
      }

      case 'clients': {
        const response = await searchClientsAgreements(trimmedQuery, 10);
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
export { searchCases, searchParties, searchClientsAgreements };
