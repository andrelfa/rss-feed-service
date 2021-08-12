import axios from "axios";

export const axiosInstance = axios.create({
  headers: { "X-Requested-With": "XMLHttpRequest" },
});

export default axiosInstance;
