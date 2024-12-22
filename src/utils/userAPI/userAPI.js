import axios from "../axiosCustomize";

// Tạo tài khoản
export const createUserApi = (name, email, password) => {
  const URL_API = "/v1/api/register";
  const data = {
    name,
    email,
    password,
  };
  return axios.post(URL_API, data);
};

// Đăng nhập
export const loginApi = (email, password) => {
  const URL_API = "/v1/api/login";
  const data = {
    email,
    password,
  };
  return axios.post(URL_API, data);
};

// Lấy data người dùng
export const getUserApi = () => {
  const URL_API = "/v1/api/user";

  return axios.get(URL_API);
};

// Lấy đơn hàng bằng id
export const makeDriverApi = (email) => {
  const URL_API = `/v1/api/becomeDriver/${email}`; // Thêm id vào URL

  return axios.post(URL_API);
};

// Lấy đơn hàng bằng id
export const makeGuestApi = (email) => {
  const URL_API = `/v1/api/becomeGuest/${email}`; // Thêm id vào URL

  return axios.post(URL_API);
};
