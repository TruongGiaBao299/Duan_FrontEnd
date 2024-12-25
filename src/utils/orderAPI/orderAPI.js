import axios from "../axiosCustomize";

// Tạo đơn hàng
export const createOrderApi = (
  senderName,
  senderNumber,
  fromAddress,
  fromDistrict,
  fromWard,
  fromCity,
  recipientName,
  recipientNumber,
  toAddress,
  toDistrict,
  toWard,
  toCity,
  orderWeight,
  orderSize,
  type,
  message
) => {
  const URL_API = "/v1/api/order";
  const data = {
    senderName,
    senderNumber,
    fromAddress,
    fromDistrict,
    fromWard,
    fromCity,
    recipientName,
    recipientNumber,
    toAddress,
    toDistrict,
    toWard,
    toCity,
    orderWeight,
    orderSize,
    type,
    message,
  };
  return axios.post(URL_API, data);
};

// Lấy đơn hàng bằng id
export const getOrderByIdApi = (id) => {
  const URL_API = `/v1/api/getorder/${id}`; // Thêm id vào URL

  return axios.get(URL_API);
};

// Lấy đơn hàng theo gmail
export const getOrderByEmailApi = () => {
  const URL_API = "/v1/api/getorderemail";

  return axios.get(URL_API);
};

// Lấy đơn hàng bằng id
export const getOrderApi = () => {
  const URL_API = `/v1/api/getorder`; // Thêm id vào URL

  return axios.get(URL_API);
};
