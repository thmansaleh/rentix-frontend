import api from "./axiosInstance";

export const getPermissions = async () => {
  const response = await api.get("/permissions");
  return response.data;
};

export const getPermissionById = async (id) => {
  const response = await api.get(`/permissions/${id}`);
  return response.data;
};

export const createPermission = async (permissionData) => {
  const response = await api.post("/permissions", permissionData);
  return response.data;
};

export const updatePermission = async (id, permissionData) => {
  const response = await api.put(`/permissions/${id}`, permissionData);
  return response.data;
};

export const deletePermission = async (id) => {
  const response = await api.delete(`/permissions/${id}`);
  return response.data;
};