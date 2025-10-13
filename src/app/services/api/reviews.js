import api from "./axiosInstance";

export const getReviews = async (employeeId = null) => {
  const url = employeeId ? `/reviews?employee_id=${employeeId}` : '/reviews';
  const response = await api.get(url);
  return response.data;
};

export const getReviewById = async (id) => {
  const response = await api.get(`/reviews/${id}`);
  return response.data;
};

export const getReviewDocuments = async (reviewId) => {
  const response = await api.get(`/reviews/${reviewId}/documents`);
  return response.data;
};

export const createReview = async (reviewData) => {
  const response = await api.post("/reviews", reviewData);
  return response.data;
};

export const updateReview = async (id, reviewData) => {
  const response = await api.put(`/reviews/${id}`, reviewData);
  return response.data;
};

export const deleteReviewDocument = async (reviewId, documentId) => {
  const response = await api.delete(`/reviews/${reviewId}/documents/${documentId}`);
  return response.data;
};

export const deleteReview = async (id) => {
  const response = await api.delete(`/reviews/${id}`);
  return response.data;
};
