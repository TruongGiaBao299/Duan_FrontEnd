import axios from "./axiosCustomize";


// Tạo tài khoản
const createUserApi = (name, email, password) =>{
    const URL_API = "/v1/api/register";
    const data = {
        name, email, password
    }
    return axios.post(URL_API, data);
}

// Đăng nhập
const loginApi = ( email, password ) =>{
    const URL_API = "/v1/api/login";
    const data = {
        email, password
    }
    return axios.post(URL_API, data);
}

// Lấy data người dùng
const getUserApi = () =>{
    const URL_API = "/v1/api/user";

    return axios.get(URL_API);
}

export {
    createUserApi, loginApi, getUserApi
}
