import axios from "axios";

axios.interceptors.request.use(function (config) {
  config.headers.Authorization = `Bearer ${localStorage.getItem("auth_token")}`;
  return config;
});

export default axios;
