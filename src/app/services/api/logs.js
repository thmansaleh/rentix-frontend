import api from "./axiosInstance";

export const getEmployeeLogs = async (id) => {
  const response = await api.get(`/logs/employee/${id}`);
  return response.data;
};
