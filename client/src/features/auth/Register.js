import React from "react";
import MetaData from "../../components/Layout/MetaData";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, selectErrorLogin } from "./authSlice";

const schema = yup
  .object({
    name: yup
      .string()
      .required("Cần nhập tên người dùng.")
      .max(15, "Tên người dùng nhiều nhất 15 ký tự."),
    email: yup
      .string()
      .required("Cần nhập email.")
      .email("Email không đúng định dạng"),
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

const Register = () => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const canSave = true;

  const error = useSelector(selectErrorLogin);

  const handleRegister = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <>
      <MetaData title="Đăng ký" />
      <div className="bg-login-register min-h-screen flex items-center justify-center px-4">
        <div className="flex rounded bg-white shadow-lg min-h-[500px] max-w-[800px] w-[100%] overflow-hidden">
          {/* img */}
          <div className="w-1/2 hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1664434341235-f77a94e1a26c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          {/*form  */}
          <div className="p-8 grow">
            <h1 className="text-2xl font-semibold mb-8">Đăng ký</h1>
            {error && <span className="text-error mb-2">{error}</span>}
            <form className="space-y-4" onSubmit={handleSubmit(handleRegister)}>
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="Tên người dùng"
                  className="border-2 rounded p-2 w-full"
                  {...register("name")}
                />
                {errors.name && (
                  <span className="text-error">{errors.name?.message}</span>
                )}
              </div>
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="Email"
                  className="border-2 rounded p-2 w-full"
                  {...register("email")}
                />
                {errors.email && (
                  <span className="text-error">{errors.email?.message}</span>
                )}
              </div>
              <div className="space-y-1">
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  className="border-2 rounded p-2 w-full"
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
                  className="border-2 rounded p-2 w-full"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <span className="text-error">
                    {errors.confirmPassword?.message}
                  </span>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  className={`btn-form ${canSave ? "" : "!disabled"}`}
                  disabled={!canSave}
                >
                  Đăng ký
                </button>
              </div>
            </form>

            <div className="text-sm font-semibold mt-4">
              <span>Đã có tài khoản? </span>
              <Link to="/login" className="text-blue-400 underline">
                Đăng nhập ở đây
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
