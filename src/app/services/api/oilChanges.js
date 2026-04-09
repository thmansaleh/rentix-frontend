import axiosInstance from './axiosInstance';

const BASE_URL = '/oil-changes';

export const getOilChanges = async () => {
  const response = await axiosInstance.get(BASE_URL);
  return response.data;
};

export const getOilChangesByCarId = async (carId) => {
  const response = await axiosInstance.get(`${BASE_URL}/car/${carId}`);
  return response.data;
};

export const getOilChange = async (id) => {
  const response = await axiosInstance.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const createOilChange = async (data) => {
  const response = await axiosInstance.post(BASE_URL, data);
  return response.data;
};

export const updateOilChange = async (id, data) => {
  const response = await axiosInstance.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

export const deleteOilChange = async (id) => {
  const response = await axiosInstance.delete(`${BASE_URL}/${id}`);
  return response.data;
};
