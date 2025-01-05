import axios from "./axiosPostOffice";

// Lấy data người dùng
export const getPostOfficeApi = () => {
  const URL_API = "/postoffice/get";

  return axios.get(URL_API);
};

// đổi status thành active
export const changeStatusPostOfficeApi = (id) => {
  const URL_API = `/postoffice/status/${id}`; // Thêm id vào URL

  return axios.post(URL_API);
};

// đổi status thành not activated
export const changeStatusNotActivatedPostOfficeApi = (id) => {
  const URL_API = `/postoffice/statusnotactive/${id}`; // Thêm id vào URL

  return axios.post(URL_API);
};