import api from "./axiosInstance";

// Get all wallets
export const getAllWallets = async () => {
  const response = await api.get('/wallets');
  return response.data;
};

// Get wallet by ID
export const getWalletById = async (id) => {
  const response = await api.get(`/wallets/${id}`);
  return response.data;
};

// Get wallets by client ID
export const getWalletsByClientId = async (clientId) => {
  const response = await api.get(`/wallets/client/${clientId}`);
  return response.data;
};

// Create new wallet
export const createWallet = async (walletData) => {
  const response = await api.post('/wallets', walletData);
  return response.data;
};

// Update wallet
export const updateWallet = async (id, walletData) => {
  const response = await api.put(`/wallets/${id}`, walletData);
  return response.data;
};

// Delete wallet
export const deleteWallet = async (id) => {
  const response = await api.delete(`/wallets/${id}`);
  return response.data;
};

// Update wallet balance
export const updateWalletBalance = async (id, amount, operation) => {
  const response = await api.patch(`/wallets/${id}/balance`, { amount, operation });
  return response.data;
};