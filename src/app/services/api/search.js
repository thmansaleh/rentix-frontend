import api from './axiosInstance';

/**
 * Unified search service for different entity types
 */

export const performSearch = async (searchQuery, searchType) => {
  try {
    if (!searchQuery || searchQuery.trim().length === 0) {
      return [];
    }

    const trimmedQuery = searchQuery.trim();

    // Use the unified search endpoint
    const response = await api.get('/search', {
      params: {
        query: trimmedQuery,
        type: searchType
      }
    });

    return response.data.success ? (response.data.data || []) : [];
  } catch (error) {
    console.error(`Search error for type ${searchType}:`, error);
    return [];
  }
};

// Export individual search functions as well
