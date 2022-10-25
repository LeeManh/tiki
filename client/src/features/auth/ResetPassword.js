import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";

import { userApi } from "../../api/userApi";
import SendIcon from "@mui/icons-material/Send";

const schema = yup
  .object({
    token: yup.string().required("Cần nhập token"),
    password: yup
      .string()
      .required("Cần nhập mật khẩu.")
      .min(6, "Mật khẩu ít nhất 6 ký tự."),
    confirmPassword: yup
      .string()
      .required("Cần nhập xác nhận mật khẩu.")
      .oneOf([yup.ref("password"), null], "Xác nhận mật khẩu không khớp.")
      .min(6, "Mật khẩu ít nhất 6 ký tự."),
  })

  .required();

const ResetPassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (data) => {
    const idToast = toast.loading("Sending");
    setLoading(true);
    try {
      const res = await userApi.resetPassword({
        token: data.token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      toast.success("Thay đổi mật khẩu thành công.");
      navigate(`/login`);
    } catch (error) {
      toast.error(error.response.data.message || "Something wrong");
    } finally {
      toast.dismiss(idToast);
      setLoading(false);
    }
  };

  return (
    <div className="bg-login-register min-h-screen flex items-center justify-center px-4 flex-col">
      <h1 className="font-semibold text-2xl text-white mb-10">
        Nhập mật khẩu mới
      </h1>

      <form
        className="max-w-[500px] w-full space-y-2"
        onSubmit={handleSubmit(handleResetPassword)}
      >
        <div className="space-y-1">
          <input
            type="text"
            placeholder="Nhập token của bạn"
            className="px-4 py-2 w-full rounded outline-none"
            {...register("token")}
          />
          {errors.token && (
            <span className="text-error">{errors.token?.message}</span>
          )}
        </div>
        <div className="space-y-1">
          <input
            type="password"
            placeholder="Nhập mật khẩu mới"
            className="px-4 py-2 w-full rounded outline-none"
            {...register("password")}
          />
          {errors.password && (
            <span className="text-error">{errors.password?.message}</span>
          )}
        </div>

        <div className="space-y-1">
          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            className="px-4 py-2 w-full rounded outline-none"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <span className="text-error">
              {errors.confirmPassword?.message}
            </span>
          )}
        </div>

        <button
          className={`flex items-center gap-x-2 justify-center mt-4 max-w-[500px] w-full  px-4 py-2 text-white font-semibold rounded outline-none disabled:cursor-default ${
            loading ? "bg-gray-400" : "bg-green-400"
          }`}
          disabled={loading}
        >
          {loading ? (
            <>
              <span>Loading...</span>
            </>
          ) : (
            <>
              <SendIcon />
              <span>Gửi</span>
            </>
          )}
        </button>
      </form>

      <Link
        to={"/login"}
        className="mt-10 text-white font-semibold hover:underline duration-200"
      >
        Quay lại đăng nhập
      </Link>
    </div>
  );
};

export default ResetPassword;
