import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, selectErrorLogin } from "./authSlice";
import MetaData from "../../components/Layout/MetaData";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup
  .object({
    email: yup
      .string()
      .required("Cần nhập email.")
      .email("Email không đúng định dạng"),
    password: yup
      .string()
      .required("Cần nhập mật khẩu.")
      .min(6, "Mật khẩu ít nhất 6 ký tự."),
  })
  .required();

const Login = () => {
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

  const handleLogin = (data) => {
    dispatch(loginUser(data));
  };

  return (
    <>
      <MetaData title="Đăng nhập" />
      <div className="bg-login-register min-h-screen flex items-center justify-center px-4">
        <div className="flex rounded bg-white shadow-lg min-h-[500px] w-[800px] overflow-hidden">
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
            <h1 className="text-2xl font-semibold mb-8">Đăng nhập</h1>
            {error && <span className="text-error mb-2">{error}</span>}
            <form className="space-y-4" onSubmit={handleSubmit(handleLogin)}>
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
              <div className="flex justify-between">
                <button
                  className={`btn-form ${canSave ? "" : "!disabled"}`}
                  disabled={!canSave}
                >
                  Đăng nhập
                </button>
                <Link to="/forgot-password" className="text-sm font-semibold">
                  Quên mật khẩu ?
                </Link>
              </div>
            </form>

            <div className="text-sm font-semibold mt-4">
              <span>Chưa có tài khoản? </span>
              <Link to="/register" className="text-blue-400 underline">
                Đăng ký ở đây
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
