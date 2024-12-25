import axios from "../axiosCustomize";

// Lấy data người dùng
export const getLocationAPI = () => {
  const URL_API = "/v1/api/location";

  return axios.get(URL_API);
};
