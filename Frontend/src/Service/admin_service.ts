import axios from "axios"
import { baseURL } from "../Constants/routes_constants"
import { endpoints } from "../Constants/end_points"
import { IallProduct,Icategory } from "../Interfaces/common_interfaces"
import * as http from "../Utils/http";
import { get } from "../Utils/http";
import {post} from "../Utils/http";
import {put} from "../Utils/http";
import { remove } from "../Utils/http";



export const getAllProduct=async (): Promise<any>=>{
    const res=await get(`${baseURL}${endpoints.admin.GETALLPRODUCTS}`)
    return res.data;
}

export const getUsersData=async (): Promise<any>=>{
    const res=await get(`${baseURL}${endpoints.admin.GETUSERSDATA}`)
    return res.data;
}

export const addProduct=async(data:IallProduct):Promise<any>=>{
    const res=await post(`${baseURL}${endpoints.admin.ADDPRODUCT}`,data)
    return res.data;
}

export const addCategory=async(data:Icategory):Promise<any>=>{
    const res=await post(`${baseURL}${endpoints.admin.ADD_CATEGORY}`,data)
    return res.data;
}

export const findandUpdateProduct=async(id:string): Promise<any>=>{
   const res=await put(`${baseURL}${endpoints.admin.UPDATE_ENUMS}${id}`)
   return res.data;
}

export const findandDeleteProduct=async(id:String): Promise<any>=>{
    const res=await remove(`${baseURL}${endpoints.admin.DELETE_PRODUCT}${id}`)
    return res.data;
}

export const findandDeleteUser=async(id:String): Promise<any>=>{
    const res=await remove(`${baseURL}${endpoints.admin.DELETE_USER}${id}`)
    return res.data;
}

export const undoProduct=async(id:String):Promise<any>=>{
    const res=await put(`${baseURL}${endpoints.admin.UNDO_PRODUCT}${id}`)
    return res.data;
}

export const fetchCategory=async():Promise<any>=>{
    const res=await get(`${baseURL}${endpoints.admin.GET_CATEGORY}`)
    return res.data;
}


export const select_database=async(data:string)=>{
    const res=await axios.post(`${baseURL}${endpoints.admin.SELECT_DB}`,data)
    return res.data;
}

export const getPaymentDetails=async (): Promise<any>=>{
    const res=await get(`${baseURL}${endpoints.admin.GET_PAYMENT_DETAILS}`)
    return res.data;
}