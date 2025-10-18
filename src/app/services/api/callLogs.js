import api from "./axiosInstance";

// Get all call logs with pagination and filters
export const getAllCallLogs = async (params = {}) => {
  const response = await api.get('/call-logs', { params });
  return response.data;
};

// Get call log by ID
export const getCallLogById = async (id) => {
  const response = await api.get(`/call-logs/${id}`);
  return response.data;
};

// Create new call log
export const createCallLog = async (callLogData) => {
  const response = await api.post('/call-logs', callLogData);
  return response.data;
};

// Update call log
export const updateCallLog = async (id, callLogData) => {
  const response = await api.put(`/call-logs/${id}`, callLogData);
  return response.data;
};

// Delete call log
export const deleteCallLog = async (id) => {
  const response = await api.delete(`/call-logs/${id}`);
  return response.data;
};