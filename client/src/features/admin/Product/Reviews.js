import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { reviewApi } from "../../../api/reviewApi";
import CircularProgress from "@mui/material/CircularProgress";
import TableReviews from "./TableReviews";
import TablePagination from "@mui/material/TablePagination";

const Reviews = () => {
  const { id } = useParams();

  const [data, setData] = useState({
    reviews: [],
    count: 1,
    limit: 1,
  });
  const [loadingFetchReviews, setLoadingFetchReviews] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const path = useMemo(() => {
    return `page=${page + 1}&limit=${rowsPerPage}`;
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (idReview) => {
    const idToast = toast.loading("Đang xóa ...");
    try {
      await reviewApi.deleteReview({ productId: id, idReview });
      setData({
        ...data,
        reviews: data.reviews.filter((review) => review._id !== idReview),
      });
      toast.success("Xóa đánh giá thành công 🎉.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something wrong!!");
    } finally {
      toast.dismiss(idToast);
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await reviewApi.getAllReviewSingleProduct(id, path);
        setData({
          reviews: res.data.reviews,
          count: res.data.count,
          limit: res.data.limit,
        });
      } catch (error) {
        toast.error(error.response.data.message || "Something wrong!!");
      } finally {
        setLoadingFetchReviews(false);
      }
    };

    fetchReviews();
  }, [id, path]);

  return (
    <div className="container-cus wrapper">
      <div className="bg-white my-4 p-4">
        <h1 className="text-lg font-semibold">Chi tiết đánh giá / nhận xét</h1>
      </div>
      {loadingFetchReviews ? (
        <div className="bg-white my-4 p-4 flex justify-center">
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="bg-white my-4 p-4 overflow-auto">
            <div className="w-full table table-fixed">
              <TableReviews
                reviews={data.reviews}
                handleDelete={handleDelete}
              />
            </div>
          </div>

          <div className="bg-white my-4 p-4 overflow-auto">
            <TablePagination
              component="div"
              count={data.count}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 15]}
              labelRowsPerPage={"Đánh giá / nhận xét mỗi trang"}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Reviews;
