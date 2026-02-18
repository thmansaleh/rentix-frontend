import axiosInstance from './axiosInstance';

const BASE_URL = '/rental-terms';

// Get all rental terms
export const getRentalTerms = async () => {
  try {
    const response = await axiosInstance.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching rental terms:', error);
    throw error;
  }
};

// Get active rental terms
export const getActiveRentalTerms = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/active`);
    return response.data;
  } catch (error) {
    console.error('Error fetching active rental terms:', error);
    throw error;
  }
};

// Get single rental term
export const getRentalTerm = async (id) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching rental term ${id}:`, error);
    throw error;
  }
};

// Create rental term
export const createRentalTerm = async (data) => {
  try {
    const response = await axiosInstance.post(BASE_URL, data);
    return response.data;
  } catch (error) {
    console.error('Error creating rental term:', error);
    throw error;
  }
};

// Update rental term
export const updateRentalTerm = async (id, data) => {
  try {
    const response = await axiosInstance.put(`${BASE_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating rental term ${id}:`, error);
    throw error;
  }
};

// Delete rental term
export const deleteRentalTerm = async (id) => {
  try {
    const response = await axiosInstance.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting rental term ${id}:`, error);
    throw error;
  }
};

// Toggle rental term status
export const toggleRentalTermStatus = async (id, isActive) => {
  try {
    const response = await axiosInstance.patch(`${BASE_URL}/${id}/toggle`, {
      is_active: isActive
    });
    return response.data;
  } catch (error) {
    console.error(`Error toggling rental term status ${id}:`, error);
    throw error;
  }
};
