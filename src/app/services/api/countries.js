import api from "./axiosInstance";

// Get all countries
export const getCountries = async () => {
  const response = await api.get("/countries");
  return response.data;
};
