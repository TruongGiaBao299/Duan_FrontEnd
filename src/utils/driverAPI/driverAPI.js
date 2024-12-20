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

// Lấy đơn hàng bằng id
export const changeStatusDriverApi = (id) => {
  const URL_API = `/v1/api/driver/${id}`; // Thêm id vào URL

  return axios.post(URL_API);
};
