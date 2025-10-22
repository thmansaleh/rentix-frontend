import api from "./axiosInstance";

// Get all wallet deposits
export const getAllWalletDeposits = async () => {
  const response = await api.get('/wallet-deposits');
  return response.data;
};

// Get wallet deposit by ID
export const getWalletDepositById = async (id) => {
  const response = await api.get(`/wallet-deposits/${id}`);
  return response.data;
};

// Get deposits by wallet ID
export const getDepositsByWalletId = async (walletId) => {
  const response = await api.get(`/wallet-deposits/wallet/${walletId}`);
  return response.data;
};

// Get deposits by client ID
export const getDepositsByClientId = async (clientId) => {
  const response = await api.get(`/wallet-deposits/client/${clientId}`);
  return response.data;
};

// Create new wallet deposit
export const createWalletDeposit = async (depositData) => {
  const response = await api.post('/wallet-deposits', depositData);
  return response.data;
};

// Update wallet deposit
export const updateWalletDeposit = async (id, depositData) => {
  const response = await api.put(`/wallet-deposits/${id}`, depositData);
  return response.data;
};

// Delete wallet deposit
export const deleteWalletDeposit = async (id) => {
  const response = await api.delete(`/wallet-deposits/${id}`);
  return response.data;
};
