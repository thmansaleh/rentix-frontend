import api from "./axiosInstance";

// Get wallets with pagination, filtering and search
export const getWalletStats = async () => {
  const response = await api.get('/wallets/stats');
  return response.data;
};

export const getWallets = async (params) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    status,
    currency,
    sortBy = "created_at",
    sortOrder = "desc"
  } = params;

  // Build query string
  const queryParams = new URLSearchParams();
  queryParams.append("page", page);
  queryParams.append("limit", limit);
  if (search) queryParams.append("search", search);
  if (status) queryParams.append("status", status);
  if (currency) queryParams.append("currency", currency);
  if (sortBy) queryParams.append("sortBy", sortBy);
  if (sortOrder) queryParams.append("sortOrder", sortOrder);

  const response = await api.get(`/wallets?${queryParams.toString()}`);
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
  try {
    const response = await api.post('/wallets', walletData);
    return response.data;
  } catch (error) {
    // If backend returns validation error (like duplicate wallet), return the error data
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw error;
  }
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

// Get account statement (deposits and expenses) for a wallet with date range
export const getAccountStatement = async (walletId, fromDate, toDate) => {
  const queryParams = new URLSearchParams();
  if (fromDate) queryParams.append("from", fromDate);
  if (toDate) queryParams.append("to", toDate);
  
  const response = await api.get(`/wallets/${walletId}/statement?${queryParams.toString()}`);
  return response.data;
};