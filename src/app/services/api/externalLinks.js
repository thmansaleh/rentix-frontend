import api from "./axiosInstance";

// Get all external links
export const getExternalLinks = async () => {
  const response = await api.get('/external-links');
  return response.data;
};

// Create a new external link
export const createExternalLink = async (linkData) => {
  const response = await api.post('/external-links', linkData);
  return response.data;
};

// Delete an external link
export const deleteExternalLink = async (id) => {
  const response = await api.delete(`/external-links/${id}`);
  return response.data;
};
