import axiosClient from "./axiosClient";

// --addmin
const getAllReviewSingleProduct = (id, path = "") => {
  const url = `reviews?productId=${id}&${path}`;
  return axiosClient.get(url);
};

const deleteReview = ({ productId, idReview, path }) => {
  const url = `reviews?productId=${productId}&idReview=${idReview}`;
  return axiosClient.delete(url);
};

export const reviewApi = {
  getAllReviewSingleProduct,
  deleteReview,
};
