import axios from "axios";

const axiosClient = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:4000/api/v1/",
});

export default axiosClient;
