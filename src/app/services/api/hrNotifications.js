import api from "./axiosInstance";

export const getHrNotifications = async (daysThreshold = 30) => {
  const params = daysThreshold !== 30 ? { days_threshold: daysThreshold } : {};
  const response = await api.get('/hr-notifications', { params });
  return response.data;
};