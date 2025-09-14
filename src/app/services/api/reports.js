import api from "./axiosInstance";

export const getReportById = async (id) => {
  const response = await api.get(`/reports/${id}`);
  return response.data;
};

