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
    email: yup
      .string()
      .required("Cần nhập email.")
      .email("Email không đúng định dạng"),
  })
  .required();

const ForgotPassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);

  const handleSendToken = async (data) => {
    const idToast = toast.loading("Sending");
    setLoading(true);
    try {
      const res = await userApi.forgotPassword({ email: data.email });
      toast.success("Gửi thành công. Vui lòng check email của bạn");
      navigate(`/password/reset`);
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
        Bạn đã quên mật khẩu ?
      </h1>

      <form
        className="max-w-[500px] w-full"
        onSubmit={handleSubmit(handleSendToken)}
      >
        {errors.email && (
          <span className="text-error">{errors.email?.message}</span>
        )}
        <input
          type="text"
          placeholder="Nhập email của bạn"
          className="px-4 py-2 w-full rounded outline-none"
          {...register("email")}
        />

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

export default ForgotPassword;
