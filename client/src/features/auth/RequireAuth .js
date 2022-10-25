import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";

const RequireAuth = ({ allowedRoles }) => {
  const { roles } = useSelector(selectUser);

  const content = roles?.some((role) => allowedRoles.includes(role)) ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );

  return content;
};

export default RequireAuth;
