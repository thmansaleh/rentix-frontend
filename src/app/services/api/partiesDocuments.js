import axiosInstance from './axiosInstance';

/**
 * Delete a party document by ID
 * @param {number} documentId - The ID of the document to delete
 * @returns {Promise} Response from the server
 */
export const deletePartyDocument = async (documentId) => {
  try {
    const response = await axiosInstance.delete(`/parties-documents/${documentId}`);
    return response.data;
  } catch (error) {

    throw error;
  }
};

/**
 * Get all documents for a specific party
 * @param {number} partyId - The ID of the party
 * @returns {Promise} Response with party documents
 */
export const getDocumentsByPartyId = async (partyId) => {
  try {
    const response = await axiosInstance.get(`/parties-documents/party/${partyId}`);
    return response.data;
  } catch (error) {

    throw error;
  }
};

/**
 * Upload documents for a party
 * @param {FormData} formData - The form data containing files and party information
 * @returns {Promise} Response from the server
 */
export const uploadPartyDocuments = async (formData) => {
  try {
    const response = await axiosInstance.post('/parties-documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {

    throw error;
  }
};
