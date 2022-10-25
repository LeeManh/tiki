import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { orderApi } from "../../../api/orderApi";
import CircularProgress from "@mui/material/CircularProgress";
import TablePagination from "@mui/material/TablePagination";
import TableOrder from "./TableOrder";

const Orders = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    count: 0,
    limit: 0,
    orders: [],
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  // call api to delete after confirm
  const handleDelete = async (id) => {
    const idToast = toast.loading("Đang xóa đơn hàng ...");
    try {
      await orderApi.deleteOrderAmin(id);
      setData({
        ...data,
        orders: data.orders.filter((order) => order._id !== id),
      });
      toast.success("Xóa đơn hàng thành công 🎉.");
    } catch (error) {
      toast.error(error.response.data.message || "Something wrong!!");
    } finally {
      toast.dismiss(idToast);
    }
  };

  const path = useMemo(() => {
    return `page=${page + 1}&limit=${rowsPerPage}`;
  }, [page, rowsPerPage]);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);

      try {
        const res = await orderApi.getAllOrdersAdmin(path);
        setData({
          orders: res.data.orders,
          count: res.data.count,
          limit: res.data.limit,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [path]);

  return (
    <div className="container-cus wrapper">
      <div className="bg-white my-4 p-4">
        <h1 className="text-lg font-semibold">Danh sách đơn đặt hàng</h1>
      </div>

      {loading ? (
        <div className="bg-white my-4 p-4 flex justify-center">
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="bg-white my-4 p-4 overflow-auto">
            <div className="w-full table table-fixed">
              <TableOrder orders={data.orders} handleDelete={handleDelete} />
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
              labelRowsPerPage={"Đơn hàng mỗi trang"}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Orders;
