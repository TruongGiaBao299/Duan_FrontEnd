import axios from "../axiosCustomize";

// Tạo đơn hàng
export const createDriverApi = (
  DriverName,
  DriverNumber,
  DriverBirth,
  DriverId,
  DriverAddress,
  DriverCity
) => {
  const URL_API = "/v1/api/driver";
  const data = {
    DriverName,
    DriverNumber,
    DriverBirth,
    DriverId,
    DriverAddress,
    DriverCity,
  };
  return axios.post(URL_API, data);
};

// Lấy dữ liệu tài xế
export const getDriverApi = () => {
  const URL_API = `/v1/api/getdriver`;

  return axios.get(URL_API);
};

// kích hoạt hoạt động tài xế
export const changeStatusDriverApi = (email) => {
  const URL_API = `/v1/api/driver/${email}`; // Thêm id vào URL

  return axios.post(URL_API);
};

// ngừng kích hoạt tài xế
export const changeStatusDriverToGuestApi = (email) => {
  const URL_API = `/v1/api/driverUnActive/${email}`; // Thêm id vào URL

  return axios.post(URL_API);
};

// Lấy đơn hàng theo gmail của tài xế
export const getDriverOrderByEmailApi = () => {
  const URL_API = "/v1/api/getdriverorderemail";

  return axios.get(URL_API);
};

// Tài xế nhận đơn hàng
export const AcceptOrderApi = (id) => {
  const URL_API = `/v1/api/updateorderdriver/${id}`; // Thêm id vào URL

  return axios.post(URL_API);
};

// Tài xế hủy đơn hàng
export const CancelledOrderApi = (id) => {
  const URL_API = `/v1/api/updateordercancelled/${id}`; // Thêm id vào URL

  return axios.post(URL_API);
};

// Tài xế đã giao đơn hàng
export const ShippedOrderApi = (id) => {
  const URL_API = `/v1/api/updateordershipped/${id}`; // Thêm id vào URL

  return axios.post(URL_API);
};

// kích hoạt hoạt động tài xế
export const deleteRequestDriver = (email) => {
  const URL_API = `/v1/api/driverrequest/${email}`; // Thêm id vào URL

  return axios.delete(URL_API);
};