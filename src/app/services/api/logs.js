import api from "./axiosInstance";

export const getEmployeeLogs = async (id) => {
  const response = await api.get(`/logs/employee/${id}`);
  return response.data;
};

export const getAllLogs = async (page = 1, limit = 50, startDate = '', endDate = '') => {
  let url = `/logs?page=${page}&limit=${limit}`;
  
  if (startDate && endDate) {
    url += `&startDate=${startDate}&endDate=${endDate}`;
  }
  
  const response = await api.get(url);
  return response.data;
};
