import api from "./axiosInstance";

export const getPublicProsecutions = async () => {
  const response = await api.get("/public-prosecutions");
  return response.data;
};

export const createPublicProsecution = async (data) => {
  const response = await api.post("/public-prosecutions", data);
  return response.data;
};
