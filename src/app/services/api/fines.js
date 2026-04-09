import axiosInstance from './axiosInstance';

const BASE_URL = '/fines';

// Get all fines (tickets)
export const getFines = async ({ inquiryType = 1, trafficFileNo } = {}) => {
  try {
    const params = { inquiryType };
    if (trafficFileNo) params.trafficFileNo = trafficFileNo;
    const response = await axiosInstance.get(BASE_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching fines:', error);
    throw error;
  }
};

export const getSalikBalance = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/salik`);
    return response.data;
  } catch (error) {
    console.error('Error fetching salik balance:', error);
    throw error;
  }
};

// Get fines for a specific vehicle using its carId
export const getVehicleFines = async (carId) => {
  try {
    const response = await axiosInstance.post(`${BASE_URL}/vehicle`, { carId });
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicle fines:', error);
    throw error;
  }
};
