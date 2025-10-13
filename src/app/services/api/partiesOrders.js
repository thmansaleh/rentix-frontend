import api from "./axiosInstance";

// Get all parties orders with pagination and filters
export const getPartiesOrders = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page);
  if (params.limit) queryParams.append('limit', params.limit);
  if (params.party_id) queryParams.append('party_id', params.party_id);
  if (params.status) queryParams.append('status', params.status);
  if (params.type) queryParams.append('type', params.type);
  if (params.search) queryParams.append('search', params.search);
  
  const queryString = queryParams.toString();
  const url = queryString ? `/parties-orders?${queryString}` : '/parties-orders';
  
  const response = await api.get(url);
  return response.data;
};

// Get a single party order by ID
export const getPartyOrderById = async (id) => {
  const response = await api.get(`/parties-orders/${id}`);
  return response.data;
};

// Get all orders for a specific party
export const getOrdersByPartyId = async (partyId) => {
  const response = await api.get(`/parties-orders/party/${partyId}`);
  return response.data;
};

// Create a new party order
export const createPartyOrder = async (orderData) => {
  const response = await api.post('/parties-orders', orderData);
  return response.data;
};

// Update a party order
export const updatePartyOrder = async (id, orderData) => {
  const response = await api.put(`/parties-orders/${id}`, orderData);
  return response.data;
};

// Delete a party order
export const deletePartyOrder = async (id) => {
  const response = await api.delete(`/parties-orders/${id}`);
  return response.data;
};
