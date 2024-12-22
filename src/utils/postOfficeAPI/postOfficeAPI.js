import axios from "../axiosCustomize";

// Lấy data người dùng
export const getPostOfficeApi = () => {
  const URL_API = "/v1/api/getpostoffice";

  return axios.get(URL_API);
};

// đổi status thành active
export const changeStatusPostOfficeApi = (id) => {
  const URL_API = `/v1/api/postoffice/${id}`; // Thêm id vào URL

  return axios.post(URL_API);
};

// đổi status thành not activated
export const changeStatusNotActivatedPostOfficeApi = (id) => {
  const URL_API = `/v1/api/postofficeUnActive/${id}`; // Thêm id vào URL

  return axios.post(URL_API);
};