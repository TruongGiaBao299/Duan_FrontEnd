import axios from "./axiosCustomize";
import { createOrderApi, getOrderByIdApi, getOrderApi } from "./orderAPI/orderAPI";
import { getPostOfficeApi } from "./postOfficeAPI/postOfficeAPI";
import { createUserApi, getUserApi, loginApi } from "./userAPI/userAPI";

export { createUserApi, loginApi, getUserApi, createOrderApi, getOrderByIdApi, getPostOfficeApi, getOrderApi };
