import api from "./axiosInstance";

export const getSickLeaves = async (employeeId = null) => {
  const url = employeeId ? `/sick-leaves?employee_id=${employeeId}` : '/sick-leaves';
  const response = await api.get(url);
  return response.data;
};

export const getSickLeaveById = async (id) => {
  const response = await api.get(`/sick-leaves/${id}`);
  return response.data;
};

export const createSickLeave = async (sickLeaveData) => {
  const response = await api.post("/sick-leaves", sickLeaveData);
  return response.data;
};

export const updateSickLeave = async (id, sickLeaveData) => {
  const response = await api.put(`/sick-leaves/${id}`, sickLeaveData);
  return response.data;
};

export const deleteSickLeave = async (id) => {
  const response = await api.delete(`/sick-leaves/${id}`);
  return response.data;
};
