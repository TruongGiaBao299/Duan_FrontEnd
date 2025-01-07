import axios from "./axiosPostOffice";

// Lấy data người dùng
export const getPostOfficeApi = () => {
  const URL_API = "/postoffice/get";

  return axios.get(URL_API);
};

// đổi status thành active
export const changeStatusPostOfficeApi = (email) => {
  const URL_API = `/postoffice/status/${email}`; // Thêm id vào URL

  return axios.post(URL_API);
};

// đổi status thành not activated
export const changeStatusNotActivatedPostOfficeApi = (email) => {
  const URL_API = `/postoffice/statusnotactive/${email}`; // Thêm id vào URL

  return axios.post(URL_API);
};

// xóa bưu cục
export const deleteRequestPostOffice = (email) => {
  const URL_API = `/postoffice/delete/${email}`; // Thêm id vào URL

  return axios.delete(URL_API);
};

// tạo bưu cục
export const createPostOfficeApi = (
  OfficeUserName,
  OfficeUserId,
  OfficeUserNumber,
  OfficeUserAddress,
  OfficeUserEmail,
  OfficeName,
  OfficeHotline,
  OfficeAddress,
  OfficeDistrict,
  OfficeWard,
  OfficeCity,
) => {
  const URL_API = "/postoffice/create";
  const data = {
    OfficeUserName,
    OfficeUserId,
    OfficeUserNumber,
    OfficeUserAddress,
    OfficeUserEmail,
    OfficeName,
    OfficeHotline,
    OfficeAddress,
    OfficeDistrict,
    OfficeWard,
    OfficeCity,
  };
  return axios.post(URL_API, data);
};