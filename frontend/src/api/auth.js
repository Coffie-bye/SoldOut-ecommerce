import api from "./axiosConfig";

export const registerUser = (userData) => api.post("/users/register", userData);
export const loginUser = (credentials) => api.post("/users/login", credentials);
export const getProfile = () => api.get("/users/profile");
