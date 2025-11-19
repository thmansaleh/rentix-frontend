import api from "./axiosInstance";

/**
 * Chat with the legal assistant
 * @param {Object} payload - The chat payload
 * @param {string} payload.message - The user's message
 * @param {string} payload.userName - The user's name
 * @param {string|number} payload.userId - The user's ID
 * @param {Array} payload.history - The conversation history
 * @returns {Promise} API response with answer and sources
 */
export const chatWithLegalAssistant = async (payload) => {
  const response = await api.post("/legal-assistant", payload);
  return response.data;
};

export default {
  chatWithLegalAssistant,
};
