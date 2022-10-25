import axiosClient from "./axiosClient";

// --user
const updatePassword = (params) => {
  const url = "me/update";
  return axiosClient.put(url, { ...params });
};
const updateProfile = (params) => {
  const url = "me/update/infor";
  return axiosClient.put(url, { ...params });
};
const forgotPassword = ({ email }) => {
  const url = "password/forgot";
  return axiosClient.post(url, { email });
};
const resetPassword = ({ token, password, confirmPassword }) => {
  const url = `password/reset/${token}`;
  return axiosClient.put(url, { password, confirmPassword });
};

// --addmin
const getAllUsersAdmin = (path) => {
  const url = `admin/users?${path}`;
  return axiosClient.get(url);
};
const deleteUserAdmin = (id) => {
  const url = `admin/users/${id}`;
  return axiosClient.delete(url);
};
const changeRoles = ({ id, data }) => {
  const url = `admin/users/${id}`;
  return axiosClient.put(url, data);
};
const getSingleUser = (id) => {
  const url = `admin/users/${id}`;
  return axiosClient.get(url);
};
const getUsersStats = () => {
  const url = `admin/users/stats`;
  return axiosClient.get(url);
};

export const userApi = {
  updatePassword,
  updateProfile,
  getAllUsersAdmin,
  deleteUserAdmin,
  changeRoles,
  getSingleUser,
  getUsersStats,
  forgotPassword,
  resetPassword,
};
