import api from "./axiosInstance";

// Get company settings
export const getCompanySettings = async () => {
  const response = await api.get('/company-settings');
  return response.data;
};

// Update company settings
export const updateCompanySettings = async (settingsData) => {
  const response = await api.put('/company-settings', settingsData);
  return response.data;
};
