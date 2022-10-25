import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice";

const useShowElement = ({ allowedRoles }) => {
  const { roles } = useSelector(selectUser);

  const isShow = roles?.some((role) => allowedRoles.includes(role));

  return isShow;
};

export default useShowElement;
