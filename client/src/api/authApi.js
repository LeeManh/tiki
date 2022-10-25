import axiosClient from "./axiosClient";

const login = async (params) => {
  const url = "login";

  return axiosClient.post(url, { ...params });
};
const logout = async () => {
  const url = "logout";
  return axiosClient.get(url);
};
const register = async (params) => {
  const url = "register";
  return axiosClient.post(url, { ...params });
};

export const authApi = {
  login,
  logout,
  register,
};
