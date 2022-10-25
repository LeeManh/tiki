import axiosClient from "./axiosClient";

const getStripeApiKey = async () => {
  const url = `stripeapikey`;
  return await axiosClient.get(url);
};

const payment = async ({ amount }) => {
  const url = "payment/process";
  return await axiosClient.post(url, { amount });
};

const createOrder = async (order) => {
  const url = "order/new";
  return await axiosClient.post(url, order);
};

export const paymentApi = {
  getStripeApiKey,
  payment,
  createOrder,
};
