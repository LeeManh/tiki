import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../features/auth/authSlice";

const LoginRoutes = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  let content;

  if (isAuthenticated) {
    content = <Navigate to="/" replace />;
  } else {
    content = <Outlet />;
  }

  return content;
};

export default LoginRoutes;
