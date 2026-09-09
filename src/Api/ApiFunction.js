import axios from "axios";
import { endPointPort, endPointPortAgent } from "./endPoints";


// const determineBaseURL = () => {
//   const isSuperAdmin = localStorage.getItem("isSuperAdmin");
//   return isSuperAdmin ? endPointPort : endPointPortAgent;
// };

const axiosInstance = axios.create({
  baseURL: endPointPort,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");
    const isSuperAdmin = localStorage.getItem("issuperadmin");
    config.headers['Authorization'] = token ? `Bearer ${token}` : "";
    config.headers['user'] = userId ? userId : "";
    config.headers['issuperadmin'] = isSuperAdmin ? isSuperAdmin : "";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const apiFunction = async (URL, method, payload, headers) => {
  try {
    const config = {
      method: method,
      url: URL,
      ...(payload && { data: payload }),
      ...(headers && {headers : headers})
    };

    const res = await axiosInstance(config);
    return res;
  } catch (err) {
    console.error("Error in API call:", err);
    return err;
  }
};