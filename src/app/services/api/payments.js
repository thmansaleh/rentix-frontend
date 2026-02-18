import api from "./axiosInstance";

// Get all payments with pagination and filters
export const getPayments = async (params = {}) => {
  const response = await api.get("/payments", { params });
  return response.data;
};

// Get all payments for a contract
export const getPaymentsByContractId = async (contractId) => {
  const response = await api.get(`/payments/contract/${contractId}`);
  return response.data;
};

// Get payment by ID
export const getPaymentById = async (id) => {
  const response = await api.get(`/payments/${id}`);
  return response.data;
};

// Create new payment
export const createPayment = async (paymentData) => {
  const response = await api.post("/payments", paymentData);
  return response.data;
};

// Update payment
export const updatePayment = async (id, paymentData) => {
  const response = await api.put(`/payments/${id}`, paymentData);
  return response.data;
};

// Delete payment
export const deletePayment = async (id) => {
  const response = await api.delete(`/payments/${id}`);
  return response.data;
};
