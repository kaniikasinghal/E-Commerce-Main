import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { emailRegex,mobileNumberRegex,passwordRegex } from "../../Constants/auth_regex";

export const userSignInSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(5).max(22).required(),
  });

  export const userSignupSchema = yup.object().shape({
    name: yup
      .string()
      .required("Name is madatory to enter to the form")
      .matches(/^((?!\s\s).)*$/, 'Name cannot contain multiple spaces')
      .matches(/^[a-zA-Z\s]+$/, 'Name cannot contain numbers or symbols'),
       
   email: yup
      .string()
      .required("Email is mandatory to enter in the form")
      .matches(emailRegex, "Invalid email address"),

    password:yup
      .string()
      .required("Passwoed is mandatory to enter in the form")
      .matches(passwordRegex,"Invalid password")
      .min(8)
      .max(32),

    password_confirmation:yup
      .string()
      .required("Re-E")
      .matches(passwordRegex,"Invalid password")
      .min(8)
      .max(32)
  });