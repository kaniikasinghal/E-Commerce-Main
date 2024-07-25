import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyAdminToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = <string>req.headers["authorization"];
    const adminToken = token.split(" ")[1];
    if (!adminToken) {
      throw new Error("Token not provided");
    }

    const verifyadmin:any = jwt.verify(adminToken, process.env.JWT_SECRET_KEY as string);   
    if(verifyadmin){
      req.body.email=verifyadmin.email;
    }
    next();
  } catch (error:any) {
    console.error("Token verification failed:", error.message);
    res.json({ error: "Token verification failed" });
  }
};

