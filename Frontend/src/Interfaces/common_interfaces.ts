export interface ISignup{
    image:string,
    name:string,
    email:string,
    password:string,
    password_confirmation:string
}

export interface ILogin{
    email:string,
    password:string
}

export interface UserAuthData{
    user_id:string
    image:string
    name:string
    email:string
    isAdmin?:boolean
}

export interface IallProduct{
    _id:string,
    productname:string
    image:string
    description:string
    price:number
    category_id?:string
    enum?:string
}

export interface IcartProduct{
    _id:string,
    productname:string,
    price:number,
    description:string,
    image:string
}

export interface IcartService{
    user_id:string,
    _id:string
}

export interface Icategory{
    category_name:string
}

export interface initialProducts{
    productname:string
    image:string
    description:string
    price:number
    category?:category_obj,
}

export interface category_obj{
    _id:string,
    category_name:string
}

export interface ICheckoutProps{
    product_id:string,
    user_id:string,
    price:number
}

export interface IUpdateUser{
    name:string,
    email:string,
}

export interface IPayment {
    amount: number;
    product_ids?: [];
    type: "Buying";
  }

  export interface ISavePayment {
    user_id: string;
    product_ids: [];
    transactionId: string;
    amount: number;
  }

