import api from "./axiosInstance";

/**
 * Chat with the car rental AI assistant
 * @param {Object} payload - The chat payload
 * @param {string} payload.message - The user's message
 * @param {string} payload.userName - The user's name
 * @param {string|number} payload.userId - The user's ID
 * @param {Array} payload.history - The conversation history
 * @returns {Promise} API response with answer and sources
 */
export const chatWithRentCarAssistant = async (payload) => {
  const response = await api.post("/ai-assistant/chat", payload);
  return response.data;
};

export default {
  chatWithRentCarAssistant,
};
