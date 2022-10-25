import axiosClient from "./axiosClient";

const getAllProducts = (path) => {
  const url = `products?${path}`;

  return axiosClient.get(url);
};

const getDetailsProduct = (id) => {
  const url = `products/${id}`;
  return axiosClient.get(url);
};

const createReview = (reviewInfor) => {
  const { ratings, comment, productId } = reviewInfor;

  const url = "reviews";
  return axiosClient.post(url, { ratings, comment, productId });
};

// Admin api
const createProduct = (data) => {
  const url = "products/new";
  return axiosClient.post(url, data);
};
const deleteProduct = (id) => {
  const url = `products/${id}`;
  return axiosClient.delete(url);
};
const updateProduct = ({ id, data }) => {
  const url = `products/${id}`;
  return axiosClient.put(url, data);
};

export const productApi = {
  getAllProducts,
  getDetailsProduct,
  createReview,
  createProduct,
  deleteProduct,
  updateProduct,
};
