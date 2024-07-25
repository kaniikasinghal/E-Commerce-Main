import axios, { AxiosResponse } from "axios";
import { withData, withError } from "./Api"
import { getAccessToken } from "../Helper/Storage";


export const http = axios.create({

    headers: { "Content-Type": "application/json" },

  });

  http.interceptors.request.use(async(req) => {
    if (getAccessToken && req.headers) {
      const token = await getAccessToken().then((accessToken: any) => {return accessToken});  
      req.headers['Authorization'] = `Bearer ${token}`;
    }
    return req;
  });



  

  http.interceptors.response.use(
    (res) => withData(res.data) as AxiosResponse<any>,
    (err) => withError(err?.response?.data?.error)
  );

  export function get<P>(url: string, params?: P): Promise<any> {
    return http({
      method: "get",
      url,
      params,
    });
  }

  export function post<D, P>(url: string, data: D, params?: P): Promise<any> {
    return http({
      method: "post",
      url,
      data,
      params,
    });
  }

  export function put<D, P>(url: string, data?: D, params?: P): any {
    return http({
      method: "put",
      url,
      data,
      params,
    });
  }

  export function remove<P>(url: string, params?: P): any {
    return http({
      method: "delete",
      url: url,
      params: params,
    });
  }
  