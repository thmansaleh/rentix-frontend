import api from "./axiosInstance";

// Get all client payments
export const getAllClientPayments = async () => {
  const response = await api.get('/client-payments');
  return response.data;
};

// Get payments by invoice ID
export const getPaymentsByInvoiceId = async (invoiceId) => {
  const response = await api.get(`/client-payments/invoice/${invoiceId}`);
  return response.data;
};

// Get payment by ID
export const getPaymentById = async (id) => {
  const response = await api.get(`/client-payments/${id}`);
  return response.data;
};

// Create new payment
export const createClientPayment = async (paymentData) => {
  const response = await api.post('/client-payments', paymentData);
  return response.data;
};

// Update payment
export const updateClientPayment = async (id, paymentData) => {
  const response = await api.put(`/client-payments/${id}`, paymentData);
  return response.data;
};

// Delete payment
export const deleteClientPayment = async (id) => {
  const response = await api.delete(`/client-payments/${id}`);
  return response.data;
};
