import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { productApi } from "../../../api/productApi";
import TabelProduct from "./TabelProduct";
import CircularProgress from "@mui/material/CircularProgress";
import TablePagination from "@mui/material/TablePagination";
import toast from "react-hot-toast";

const Products = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    products: [],
    count: 1,
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

  const handleDelete = async (id) => {
    const idToast = toast.loading("Đang xóa ...");
    try {
      await productApi.deleteProduct(id);
      setData({
        ...data,
        products: data.products.filter((product) => product._id !== id),
      });
      toast.success("Xóa sản phẩm thành công 🎉.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something wrong!!");
    } finally {
      toast.dismiss(idToast);
    }
  };

  const path = useMemo(() => {
    return `page=${page + 1}&limit=${rowsPerPage}`;
  }, [page, rowsPerPage]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const res = await productApi.getAllProducts(path);
        setData({ products: res.data.products, count: res.data.count });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [path]);

  return (
    <div className="container-cus wrapper">
      <div className="bg-white my-4 p-4 flex items-center justify-between flex-wrap gap-y-2">
        <h1 className="text-lg font-semibold">Danh sách sản phẩm</h1>
        <Link className="btn btn--pink" to={"/admin/products/new"}>
          <span>Thêm mới</span>
        </Link>
      </div>

      {loading ? (
        <div className="bg-white my-4 p-4 flex justify-center">
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="bg-white my-4 p-4 overflow-auto">
            <div className="w-full table table-fixed">
              <TabelProduct
                products={data.products}
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
              labelRowsPerPage={"Sản phẩm mỗi trang"}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Products;
