import {
    ISignup,
    ILogin,
    IallProduct,
    IcartProduct,
    IcartService,
    IUpdateUser,
    IPayment,
    ISavePayment,
  } from "../Interfaces/common_interfaces";
  import * as http from "../Utils/http";
  import { endpoints } from "../Constants/end_points";
  import { baseURL } from "../Constants/routes_constants";
  import axios from "axios";
  import ApiResponse from "../resources/domain/IapiResponse";
import { get, post, remove, put } from "../Utils/http";

  
  export const postSignupService = async (data: ISignup): Promise<any> => {
    const res = await post(`${baseURL}${endpoints.auth.SIGNUP}`, data);
    return res.data;
  };
  
  export const postLoginService = async (data: ILogin): Promise<any> => {
    const res = await post(`${baseURL}${endpoints.auth.SIGNIN}`, data);
    return res.data;
  };
  
  export const getAllProductService = async (): Promise<any> => {
    const res = await get(
      `${baseURL}${endpoints.user.FETCH_PUBLISHED_PRODUCT}`
    );
    return res.data;
  };
  
  export const fetchCategories = async (): Promise<any> => {
    const res = await get(`${baseURL}${endpoints.user.GET_CATEGORY}`);
    return res.data;
  };
  
  export const getProductByCategory = async (id: string): Promise<any> => {
    const res = await get(
      `${baseURL}${endpoints.user.GET_PRODUCT_BY_CATEGORY}${id}`
    );
    return res.data;
  };
  
  export const addToCartService = async (data: IcartService): Promise<any> => {
    console.log("from front", data);
    const res = await post(`${baseURL}${endpoints.user.ADD_TO_CART}`, data);
    return res.data;
  };
  
  export const addToWishlist = async (data: IcartService): Promise<any> => {
    const res = await post(`${baseURL}${endpoints.user.ADD_TO_FAV}`, data);
    return res.data;
  };
  
  export const getCartData = async (): Promise<any> => {
    const res = await get(`${baseURL}${endpoints.user.GET_CART_DATA}`);
    return res.data;
  };
  
  export const deleteCartService = async (id: string): Promise<any> => {
    const res = await remove(
      `${baseURL}${endpoints.user.DELETE_CART_PRODUCT}${id}`
    );
    return res.data;
  };
  
  export const deleteWishlistService = async (id: string): Promise<any> => {
    const res = await remove(
      `${baseURL}${endpoints.user.DELETE_WISHLIST_PRDCT}${id}`
    );
    return res.data;
  };
  
  export const clearCart = async (): Promise<any> => {
    const res = await remove(
      `${baseURL}${endpoints.user.DELETE_ALL_CART_PRDCT}`
    );
    return res.data;
  };
  
  export const getWishList = async (): Promise<any> => {
    const res = await get(`${baseURL}${endpoints.user.GET_WISHLIST}`);
    return res.data;
  };
  
  export const updateUser = async (data: IUpdateUser): Promise<any> => {
    const res = await post(
      `${baseURL}${endpoints.user.UPDATE_USER_DATA}`,
      data
    );
    return res.data;
  };
  
  export const paymentStripe = (data: IPayment): Promise<any> => {
    const res = post(`${baseURL}${endpoints.payment.PAYMENT}`, data);
    return res;
  };
  
  export const savePaymentAction = (data: ISavePayment): Promise<any> => {
    const res = post(`${baseURL}${endpoints.payment.CREATE_PAYMENT}`, data);
    return res;
  };
  