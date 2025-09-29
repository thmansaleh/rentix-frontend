import api from "./axiosInstance";

export const getBranches = async () => {
  const response = await api.get("/branches");
  return response.data;
};

export const getBranchById = async (id) => {
  const response = await api.get(`/branches/${id}`);
  return response.data;
};

export const createBranch = async (branchData) => {
  const response = await api.post("/branches", branchData);
  return response.data;
};

export const updateBranch = async (id, branchData) => {
  const response = await api.put(`/branches/${id}`, branchData);
  return response.data;
};

export const deleteBranch = async (id) => {
  const response = await api.delete(`/branches/${id}`);
  return response.data;
};