import axiosInstance from './axiosInstance';

const API_URL = '/performance';

/**
 * Get performance statistics
 * Returns counts for logs and notifications
 */
export const getPerformanceStats = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/stats`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch performance stats');
  }
};

/**
 * Clear all system logs
 * This action is irreversible
 */
export const clearSystemLogs = async () => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/clear-logs`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to clear system logs');
  }
};

/**
 * Clear all notifications
 * This action is irreversible
 */
export const clearNotifications = async () => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/clear-notifications`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to clear notifications');
  }
};
