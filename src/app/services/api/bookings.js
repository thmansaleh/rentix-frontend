import api from "./axiosInstance";

// Get all bookings
export const getBookings = async () => {
  const response = await api.get("/bookings");
  return response.data;
};

// Get booking by ID
export const getBookingById = async (id) => {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
};

// Create new booking (admin — requires auth)
export const createBooking = async (bookingData) => {
  const response = await api.post("/bookings", bookingData);
  return response.data;
};

// Create booking from public website (no auth required)
export const createPublicBooking = async (bookingData) => {
  const response = await api.post("/bookings/public", bookingData);
  return response.data;
};

// Update booking
export const updateBooking = async (id, bookingData) => {
  const response = await api.put(`/bookings/${id}`, bookingData);
  return response.data;
};

// Delete booking
export const deleteBooking = async (id) => {
  const response = await api.delete(`/bookings/${id}`);
  return response.data;
};
