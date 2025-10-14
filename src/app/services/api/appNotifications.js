import api from "./axiosInstance";

// Get user notifications with optional filters
export const getAppNotifications = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.limit) params.append('limit', filters.limit);
  if (filters.offset) params.append('offset', filters.offset);
  if (filters.type) params.append('type', filters.type);
  if (filters.is_read !== undefined) params.append('is_read', filters.is_read);
  if (filters.related_type) params.append('related_type', filters.related_type);
  
  const response = await api.get(`/app-notifications?${params}`);
  return response.data;
};

// Get unread notifications count
export const getUnreadCount = async () => {
  const response = await api.get('/app-notifications/unread-count');
  return response.data;
};

// Get notification by ID
export const getNotificationById = async (id) => {
  const response = await api.get(`/app-notifications/${id}`);
  return response.data;
};

// Mark notification as read
export const markAsRead = async (id) => {
  const response = await api.put(`/app-notifications/${id}/read`);
  return response.data;
};

// Mark all notifications as read
export const markAllAsRead = async () => {
  const response = await api.put('/app-notifications/mark-all-read');
  return response.data;
};

// Delete notification
export const deleteNotification = async (id) => {
  const response = await api.delete(`/app-notifications/${id}`);
  return response.data;
};

// Create notification (admin use)
export const createNotification = async (notificationData) => {
  const response = await api.post('/app-notifications', notificationData);
  return response.data;
};