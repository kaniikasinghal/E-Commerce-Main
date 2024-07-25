export interface IPostSignup {
  name: string;
  image:string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface IPostLogin{
    email:string,
    password:string
}