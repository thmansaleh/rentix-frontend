import axiosInstance from './axiosInstance';

const BASE_URL = '/accidents';

// Get all accidents
export const getAccidents = async (params = {}) => {
  try {
    const response = await axiosInstance.get(BASE_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching accidents:', error);
    throw error;
  }
};

// Get accidents by car ID
export const getAccidentsByCarId = async (carId) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/car/${carId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching accidents for car ${carId}:`, error);
    throw error;
  }
};

// Get single accident
export const getAccident = async (id) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching accident ${id}:`, error);
    throw error;
  }
};

// Create accident
export const createAccident = async (accidentData) => {
  try {
    const response = await axiosInstance.post(BASE_URL, accidentData);
    return response.data;
  } catch (error) {
    console.error('Error creating accident:', error);
    throw error;
  }
};

// Update accident
export const updateAccident = async (id, accidentData) => {
  try {
    const response = await axiosInstance.put(`${BASE_URL}/${id}`, accidentData);
    return response.data;
  } catch (error) {
    console.error(`Error updating accident ${id}:`, error);
    throw error;
  }
};

// Delete accident
export const deleteAccident = async (id) => {
  try {
    const response = await axiosInstance.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting accident ${id}:`, error);
    throw error;
  }
};

// Get accident media
export const getAccidentMedia = async (id) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/${id}/media`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching accident media ${id}:`, error);
    throw error;
  }
};

// Add accident media
export const addAccidentMedia = async (id, fileUrl, fileName) => {
  try {
    const response = await axiosInstance.post(`${BASE_URL}/${id}/media`, {
      file_url: fileUrl,
      file_name: fileName
    });
    return response.data;
  } catch (error) {
    console.error(`Error adding accident media ${id}:`, error);
    throw error;
  }
};

// Delete accident media
export const deleteAccidentMedia = async (accidentId, mediaId) => {
  try {
    const response = await axiosInstance.delete(`${BASE_URL}/${accidentId}/media/${mediaId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting accident media ${mediaId}:`, error);
    throw error;
  }
};
