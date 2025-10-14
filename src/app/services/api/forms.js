import axiosInstance from './axiosInstance';

const API_URL = '/forms';

export const getForms = async (document_for = null) => {
  try {
    const params = document_for ? { document_for } : {};
    const response = await axiosInstance.get(API_URL, { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch forms');
  }
};

export const getFormById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch form');
  }
};

export const getFormTypes = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/types`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch form types');
  }
};

export const createForm = async (formData) => {
  try {
    const response = await axiosInstance.post(API_URL, formData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create form');
  }
};

export const updateForm = async (id, formData) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, formData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update form');
  }
};

export const deleteForm = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete form');
  }
};

export const downloadForm = async (id) => {
  try {
    // For direct download, we'll use window.open
    const baseURL = axiosInstance.defaults.baseURL || '';
    const downloadUrl = `${baseURL}${API_URL}/${id}/download`;
    window.open(downloadUrl, '_blank');
  } catch (error) {
    throw new Error('Failed to download form');
  }
};