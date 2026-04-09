import api from "./axiosInstance";

// Validate tenant code (public — checks if subdomain is a real tenant)
export const validateTenant = async () => {
  const response = await api.get('/tenant/validate');
  return response.data;
};

// Get public about fields — no auth required
export const getPublicTenantSettings = async () => {
  const response = await api.get('/tenant-settings/public');
  return response.data;
};

// Get tenant settings
export const getTenantSettings = async () => {
  const response = await api.get('/tenant-settings');
  return response.data;
};

// Update tenant settings
export const updateTenantSettings = async (settingsData) => {
  const response = await api.put('/tenant-settings', settingsData);
  return response.data;
};
