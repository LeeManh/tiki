import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { userApi } from "../../../api/userApi";
import CircularProgress from "@mui/material/CircularProgress";
import { changeRoles } from "../../auth/authSlice";

const schema = yup
  .object({
    roles: yup.string().required("Cần lựa chọn quyền."),
  })
  .required();

const EditUser = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [user, setUser] = useState("");
  const [loadingFetchUser, setLoadingFetchUser] = useState(true);

  const [loadingEditUser, setLoadingEditUser] = useState(false);

  const handleEditUser = async (data) => {
    setLoadingEditUser(true);
    const toastId = toast.loading("Loading...");

    try {
      const res = await userApi.changeRoles({ id, data });

      toast.success("Thay đổi quyền thành công 🎉.");

      dispatch(changeRoles({ roles: [`${data.roles}`] }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingEditUser(false);
      toast.dismiss(toastId);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await userApi.getSingleUser(id);
        setUser(res.data.user);
      } catch (error) {
        toast.error(error.response.data.message || "Something wrong!!");
      } finally {
        setLoadingFetchUser(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loadingFetchUser) {
    return (
      <div className="flex justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="container-cus wrapper">
      <div className="bg-white my-4 p-4">
        <h1 className="text-lg font-semibold">Thay đổi quyền người dùng</h1>
      </div>
      <div className="bg-white my-4 p-4">
        <form onSubmit={handleSubmit(handleEditUser)}>
          <div>
            <select
              className="flex items-center outline-none border px-2 py-1 w-full max-w-[300px]"
              {...register("roles")}
            >
              <option value="">Lựa chọn quyền</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <p className="text-error">{errors.roles?.message}</p>
          </div>

          <button className="btn btn--pink mt-8">Cập nhật</button>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
