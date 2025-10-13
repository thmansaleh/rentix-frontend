import api from "./axiosInstance";

export const getDeductions = async (employeeId = null) => {
  const url = employeeId ? `/deductions?employee_id=${employeeId}` : '/deductions';
  const response = await api.get(url);
  return response.data;
};

export const getDeductionById = async (id) => {
  const response = await api.get(`/deductions/${id}`);
  return response.data;
};

export const createDeduction = async (deductionData) => {
  const response = await api.post("/deductions", deductionData);
  return response.data;
};

export const updateDeduction = async (id, deductionData) => {
  const response = await api.put(`/deductions/${id}`, deductionData);
  return response.data;
};

export const deleteDeduction = async (id) => {
  const response = await api.delete(`/deductions/${id}`);
  return response.data;
};
