import api from "./axiosInstance";

export const getPoliceStations = async () => {
  const response = await api.get(`/police-stations`);
  return response.data;
};
export const createPoliceStation = async (stationData) => {
  const response = await api.post("/police-stations", stationData);
  return response.data;
};
