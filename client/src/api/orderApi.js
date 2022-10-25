import axiosClient from "./axiosClient";

const getAllOrdersAdmin = (path) => {
  const url = `admin/orders?${path}`;
  return axiosClient.get(url);
};

const deleteOrderAmin = (id) => {
  const url = `admin/order/${id}`;
  return axiosClient.delete(url);
};

const getDetailsOrder = (id) => {
  const url = `order/${id}`;
  return axiosClient.get(url);
};

const changeOrderStatus = (id, status = "Delivered") => {
  const url = `admin/order/${id}`;
  return axiosClient.put(url, { status });
};

const getAllOrdersUser = ({ page, orderStatus }) => {
  let url;
  if (orderStatus === "All") {
    url = `orders/me?page=${page}`;
  } else {
    url = `orders/me?page=${page}&orderStatus=${orderStatus}`;
  }

  return axiosClient.get(url);
};

export const orderApi = {
  getAllOrdersAdmin,
  deleteOrderAmin,
  getDetailsOrder,
  changeOrderStatus,
  getAllOrdersUser,
};
