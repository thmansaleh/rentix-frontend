import api from "./axiosInstance";

export const getCaseDegrees = async () => {
  try {
    const response = await api.get("/case-degrees");
    return response.data;
  } catch (error) {
    console.error("Error fetching case degrees:", error);
    throw error;
  }
};
export const createCaseDegree = async (caseDegreeData) => {
  const response = await api.post("/case-degrees", caseDegreeData);
  return response.data;
};
export const getCaseDegreeByCaseId = async (id) => {
  try {
    const response = await api.get(`/case-degrees/case/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching case degree by case ID:", error);
    throw error;
  }
};
export const updateCaseDegree = async (id, caseDegreeData) => {
  const response = await api.put(`/case-degrees/${id}`, caseDegreeData);
  return response.data;
};
export const deleteCaseDegree = async (id) => {
  const response = await api.delete(`/case-degrees/${id}`);
  return response.data;
};

