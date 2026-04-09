import api from "./axiosInstance";

// Get all cars
export const getCars = async (params = {}) => {
  const response = await api.get("/cars", { params });
  return response.data;
};

// Get available cars for public website (no auth required)
export const getPublicCars = async () => {
  const response = await api.get("/cars/public");
  return response.data;
};

// Get car by ID
export const getCarById = async (id) => {
  const response = await api.get(`/cars/${id}`);
  return response.data;
};

// Get maintenance history for a car
export const getCarMaintenance = async (id) => {
  const response = await api.get(`/cars/${id}/maintenance`);
  return response.data;
};

// Create a maintenance record
export const createCarMaintenance = async (id, data) => {
  const response = await api.post(`/cars/${id}/maintenance`, data);
  return response.data;
};

// Update a maintenance record
export const updateCarMaintenance = async (id, recordId, data) => {
  const response = await api.put(`/cars/${id}/maintenance/${recordId}`, data);
  return response.data;
};

// Delete a maintenance record
export const deleteCarMaintenance = async (id, recordId) => {
  const response = await api.delete(`/cars/${id}/maintenance/${recordId}`);
  return response.data;
};

// Create new car
export const createCar = async (carData) => {
  const response = await api.post("/cars", carData);
  return response.data;
};

// Update car
export const updateCar = async (id, carData) => {
  const response = await api.put(`/cars/${id}`, carData);
  return response.data;
};

// Get oil change alerts
export const getOilChangeAlerts = async (threshold = 500) => {
  const response = await api.get(`/cars/oil-alerts?threshold=${threshold}`);
  return response.data;
};

// Get maintenance date alerts
export const getMaintenanceAlerts = async (days = 7) => {
  const response = await api.get(`/cars/maintenance-alerts?days=${days}`);
  return response.data;
};

// Get insurance expiry alerts
export const getInsuranceAlerts = async (days = 30) => {
  const response = await api.get(`/cars/insurance-alerts?days=${days}`);
  return response.data;
};

// Get registration expiry alerts
export const getRegistrationAlerts = async (days = 30) => {
  const response = await api.get(`/cars/registration-alerts?days=${days}`);
  return response.data;
};

// Update oil change info
export const updateOilChange = async (id, oilData) => {
  const response = await api.patch(`/cars/${id}/oil-change`, oilData);
  return response.data;
};

// Delete car
export const deleteCar = async (id) => {
  const response = await api.delete(`/cars/${id}`);
  return response.data;
};

// Car Photos APIs
export const getCarPhotos = async (carId) => {
  const response = await api.get(`/cars/${carId}/photos`);
  return response.data;
};

export const addCarPhoto = async (carId, photoData) => {
  const response = await api.post(`/cars/${carId}/photos`, photoData);
  return response.data;
};

export const deleteCarPhoto = async (carId, photoId) => {
  const response = await api.delete(`/cars/${carId}/photos/${photoId}`);
  return response.data;
};

// Car Documents APIs
export const getCarDocuments = async (carId) => {
  const response = await api.get(`/cars/${carId}/documents`);
  return response.data;
};

export const addCarDocument = async (carId, documentData) => {
  const response = await api.post(`/cars/${carId}/documents`, documentData);
  return response.data;
};

export const deleteCarDocument = async (carId, documentId) => {
  const response = await api.delete(`/cars/${carId}/documents/${documentId}`);
  return response.data;
};
