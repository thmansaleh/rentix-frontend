import api from "./axiosInstance";

export const getEmployeeRequests = async (params = {}) => {
  const { 
    employee_id = null, 
    page = 1, 
    limit = 20,
    manager_approval = null,
    hr_approval = null,
    type = null,
    search = null
  } = params;

  const queryParams = new URLSearchParams();
  
  if (employee_id) queryParams.append('employee_id', employee_id);
  if (page) queryParams.append('page', page);
  if (limit) queryParams.append('limit', limit);
  if (manager_approval) queryParams.append('manager_approval', manager_approval);
  if (hr_approval) queryParams.append('hr_approval', hr_approval);
  if (type) queryParams.append('type', type);
  if (search) queryParams.append('search', search);

  const url = `/employee-requests?${queryParams.toString()}`;
  const response = await api.get(url);
  return response.data;
};

export const getEmployeeRequestById = async (id) => {
  const response = await api.get(`/employee-requests/${id}`);
  return response.data;
};

export const createEmployeeRequest = async (requestData) => {
  const response = await api.post("/employee-requests", requestData);
  return response.data;
};

export const updateEmployeeRequest = async (id, requestData) => {
  const response = await api.put(`/employee-requests/${id}`, requestData);
  return response.data;
};

export const updateManagerApproval = async (id, managerApproval) => {
  const response = await api.patch(`/employee-requests/${id}/manager-approval`, {
    manager_approval: managerApproval
  });
  return response.data;
};

export const updateHrApproval = async (id, hrApproval) => {
  const response = await api.patch(`/employee-requests/${id}/hr-approval`, {
    hr_approval: hrApproval
  });
  return response.data;
};

export const deleteEmployeeRequest = async (id) => {
  const response = await api.delete(`/employee-requests/${id}`);
  return response.data;
};
