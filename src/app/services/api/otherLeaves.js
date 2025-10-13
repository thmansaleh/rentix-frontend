import api from "./axiosInstance";

export const getOtherLeaves = async (employeeId = null) => {
  const url = employeeId ? `/other-leaves?employee_id=${employeeId}` : '/other-leaves';
  const response = await api.get(url);
  return response.data;
};

export const getOtherLeaveById = async (id) => {
  const response = await api.get(`/other-leaves/${id}`);
  return response.data;
};

export const createOtherLeave = async (otherLeaveData) => {
  const response = await api.post("/other-leaves", otherLeaveData);
  return response.data;
};

export const updateOtherLeave = async (id, otherLeaveData) => {
  const response = await api.put(`/other-leaves/${id}`, otherLeaveData);
  return response.data;
};

export const deleteOtherLeave = async (id) => {
  const response = await api.delete(`/other-leaves/${id}`);
  return response.data;
};
