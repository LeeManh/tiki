import axiosClient from "./axiosClient";

const addItemCart = ({ product, quantity }) => {
  const url = `addToCart`;

  return axiosClient.post(url, { ...product, quantity });
};

const getAllItemsCart = () => {
  const url = "cart";

  return axiosClient.get(url);
};

const changeQuantityItemCart = ({ cartId, quantity }) => {
  const url = `cart/${cartId}`;
  return axiosClient.put(url, { quantity });
};

const deleteItemCart = ({ cartId }) => {
  const url = `cart/${cartId}`;
  return axiosClient.delete(url);
};

const deleteMutilItemsCart = (ids) => {
  const url = `cart/delete`;
  return axiosClient.post(url, { ids });
};

export const cartApi = {
  addItemCart,
  getAllItemsCart,
  changeQuantityItemCart,
  deleteItemCart,
  deleteMutilItemsCart,
};
