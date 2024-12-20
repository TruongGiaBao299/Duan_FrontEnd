import axios from "./axiosCustomize";
import { changeStatusDriverApi, createDriverApi } from "./driverAPI/driverAPI";
import {
  createOrderApi,
  getOrderByIdApi,
  getOrderApi,
} from "./orderAPI/orderAPI";
import { getPostOfficeApi } from "./postOfficeAPI/postOfficeAPI";
import {
  createUserApi,
  getUserApi,
  loginApi,
  makeDriverApi,
  makeGuestApi,
} from "./userAPI/userAPI";
changeStatusDriverApi;
export {
  createUserApi,
  loginApi,
  getUserApi,
  createOrderApi,
  getOrderByIdApi,
  getPostOfficeApi,
  getOrderApi,
  createDriverApi,
  makeDriverApi,
  changeStatusDriverApi,
  makeGuestApi
};
