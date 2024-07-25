import { Router } from "express";
import { verifyUserToken } from "../../../Middleware/User/user_authentication";
import { payment, savePaymentDetails } from "../../Controller/stripe_controller"
import { dbType_Select } from "../../Controller/admin_controller";
import { DbType } from "../../../Middleware/SelectDatabase.ts/select_db";

const paymentRouter = Router();

paymentRouter.post("/select-db", verifyUserToken, dbType_Select);
paymentRouter.use(DbType);
paymentRouter.post("/pay", verifyUserToken,payment);
paymentRouter.post("/create-payment", verifyUserToken,savePaymentDetails);

export default paymentRouter;