import express from "express";
import { SignupApi, LoginApi} from "../../Controller/auth_controller";

const auth = express.Router();

auth.post("/signup",SignupApi); 
auth.post("/login",LoginApi);                                     

export default auth;