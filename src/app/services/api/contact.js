import axiosInstance from './axiosInstance';

const API_URL = '/contact';

/**
 * Get all contact information
 */
export const getContactData = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch contact data');
  }
};

/**
 * Update all contact information
 */
export const updateContactData = async (contactData) => {
  try {
    const response = await axiosInstance.put(API_URL, contactData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update contact data');
  }
};
