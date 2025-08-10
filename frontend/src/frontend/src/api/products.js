import api from "./axiosConfig";

export const fetchProducts = (params = {}) => api.get("/products", { params });
export const fetchProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (productData) =>
  api.post("/products", productData);
