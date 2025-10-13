import api from "./axiosInstance";

export const getAnnualLeaves = async (employeeId = null) => {
  const url = employeeId ? `/annual-leaves?employee_id=${employeeId}` : '/annual-leaves';
  const response = await api.get(url);
  return response.data;
};

export const getAnnualLeaveById = async (id) => {
  const response = await api.get(`/annual-leaves/${id}`);
  return response.data;
};

export const createAnnualLeave = async (annualLeaveData) => {
  const response = await api.post("/annual-leaves", annualLeaveData);
  return response.data;
};

export const updateAnnualLeave = async (id, annualLeaveData) => {
  const response = await api.put(`/annual-leaves/${id}`, annualLeaveData);
  return response.data;
};

export const deleteAnnualLeave = async (id) => {
  const response = await api.delete(`/annual-leaves/${id}`);
  return response.data;
};
