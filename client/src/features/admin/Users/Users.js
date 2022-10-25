import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { userApi } from "../../../api/userApi";
import CircularProgress from "@mui/material/CircularProgress";
import TableUsers from "./TableUsers";
import TablePagination from "@mui/material/TablePagination";

const Users = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    users: [],
    count: 1,
    limit: 1,
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

  const path = useMemo(() => {
    return `page=${page + 1}&limit=${rowsPerPage}`;
  }, [page, rowsPerPage]);

  const handleDelete = async (id) => {
    const idToast = toast.loading("Đang xóa ...");
    try {
      await userApi.deleteUserAdmin(id);
      setData({
        ...data,
        users: data.users.filter((user) => user._id !== id),
      });
      toast.success("Xóa người dùng thành công 🎉.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something wrong!!");
    } finally {
      toast.dismiss(idToast);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      try {
        const res = await userApi.getAllUsersAdmin(path);
        setData({
          users: res.data.users,
          count: res.data.count,
          limit: res.data.limit,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [path]);

  return (
    <div className="container-cus wrapper">
      <div className="bg-white my-4 p-4">
        <h1 className="text-lg font-semibold">Danh sách người dùng</h1>
      </div>

      {loading ? (
        <div className="bg-white my-4 p-4 flex justify-center">
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="bg-white my-4 p-4 overflow-auto">
            <div className="w-full table table-fixed">
              <TableUsers users={data.users} handleDelete={handleDelete} />
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

export default Users;
