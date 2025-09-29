import api from "./axiosInstance";

export const getCourts = async () => {
  const response = await api.get(`/courts`);
  return response.data;
};
export const createCourt = async (courtData) => {
  const response = await api.post("/courts", courtData);
  return response.data;
}
