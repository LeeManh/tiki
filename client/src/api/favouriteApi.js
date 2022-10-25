import axiosClient from "./axiosClient";

const addItemToFavourite = ({ product }) => {
  const url = `addToFavourite`;

  return axiosClient.post(url, { ...product, quantity: 1 });
};

const getAllItemsFavourite = () => {
  const url = "favourite";
  return axiosClient.get(url);
};

const deleteItemFavourite = (id) => {
  const url = `favourite/${id}`;
  return axiosClient.delete(url);
};

export const favouriteApi = {
  addItemToFavourite,
  getAllItemsFavourite,
  deleteItemFavourite,
};
