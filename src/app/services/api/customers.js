import api from "./axiosInstance";

// Get all customers with search
export const getCustomers = async (search = '') => {
  const params = search ? { search } : {};
  const response = await api.get("/customers", { params });
  return response.data;
};

// Get customer by ID
export const getCustomerById = async (id) => {
  const response = await api.get(`/customers/${id}`);
  return response.data;
};

// Create new customer
export const createCustomer = async (customerData) => {
  const response = await api.post("/customers", customerData);
  return response.data;
};

// Update customer
export const updateCustomer = async (id, customerData) => {
  const response = await api.put(`/customers/${id}`, customerData);
  return response.data;
};

// Delete customer
export const deleteCustomer = async (id) => {
  const response = await api.delete(`/customers/${id}`);
  return response.data;
};
