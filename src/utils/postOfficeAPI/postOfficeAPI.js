import axios from "../axiosCustomize";

// Lấy data người dùng
export const getPostOfficeApi = () => {
  const URL_API = "/v1/api/getpostoffice";

  return axios.get(URL_API);
};
