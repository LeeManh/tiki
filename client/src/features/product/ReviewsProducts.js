import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useNavigate } from "react-router-dom";

import Rating from "@mui/material/Rating";
import { productApi } from "../../api/productApi";
import ButtonLoading from "../../components/Button/ButtonLoading";
import { fetchDetailsProduct } from "./productDetailsSlice";
import { selectIsAuthenticated } from "../auth/authSlice";

const ReviewsProducts = ({ productDetails }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(selectIsAuthenticated);

  //state
  const [reviewInfor, setReviewInfor] = useState({
    ratings: 0,
    comment: "",
    productId: productDetails._id,
  });
  const [loading, setLoading] = useState(false);
  const canSubmit = Object.values(reviewInfor).every((val) => Boolean(val));

  const handleChangeReviewInfor = (e) => {
    setReviewInfor({ ...reviewInfor, [e.target.name]: e.target.value });
  };

  const handleCreateReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      return navigate("/login");
    }

    setLoading(true);
    try {
      await productApi.createReview({
        ...reviewInfor,
        ratings: Number(reviewInfor.ratings),
      });

      setReviewInfor({
        ratings: 0,
        comment: "",
        productId: productDetails._id,
      });
      dispatch(fetchDetailsProduct(productDetails._id));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper py-4">
      <h2 className="text-lg font-semibold">
        Đánh Giá - Nhận Xét Từ Khách Hàng
      </h2>
      <div className="mt-8">
        {productDetails.numOfReviews === 0 ? (
          <p className="text-center">Chưa có nhận xét 🐸!</p>
        ) : (
          <div>
            {productDetails.reviews.map((review) => (
              <div key={review._id} className="space-y-1 mb-6">
                <div className="flex items-center gap-x-2">
                  <Rating value={review.ratings} readOnly size="small" />
                  <span className="font-semibold">
                    {review.ratings >= 5
                      ? "Cực kỳ hài lòng"
                      : review.ratings >= 4
                      ? "Hài lòng"
                      : review.ratings >= 3
                      ? "Bình thường"
                      : review.ratings >= 2
                      ? "Không hài lòng"
                      : "Cực kỳ không hài lòng"}
                  </span>
                </div>
                <div className="flex items-center gap-x-2">
                  <p className="font-semibold">{review.name}</p>

                  <p className="text-sm text-secondary">
                    {moment(review.time).fromNow()}
                  </p>
                </div>

                <p className="text-base">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <h2 className="text-lg font-semibold mt-8">
        Đánh Giá - Nhận Xét của bạn
      </h2>
      <form onSubmit={handleCreateReview} className="mt-4 space-y-2">
        <Rating
          name="ratings"
          value={Number(reviewInfor.ratings)}
          onChange={handleChangeReviewInfor}
        />
        <textarea
          rows="5"
          className="w-full border-2 border-slate-400 rounded p-4"
          placeholder="Nhập nhận xét của bạn."
          name="comment"
          value={reviewInfor.comment}
          onChange={handleChangeReviewInfor}
        ></textarea>
        <ButtonLoading
          loading={loading}
          disabled={!canSubmit || loading ? true : false}
          text="Nhận xét"
          type="submit"
        />
      </form>
    </div>
  );
};

export default ReviewsProducts;
