import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export const fetchCourts = () => api.get("/courts");
export const fetchEquipment = () => api.get("/equipment");
export const fetchCoaches = () => api.get("/coaches");
export const fetchPricingRules = () => api.get("/pricing-rules");
export const createBooking = (data) => api.post("/bookings", data);
export const fetchBookingsByUser = (userId) => api.get(`/bookings/user/${userId}`);

export default api;
