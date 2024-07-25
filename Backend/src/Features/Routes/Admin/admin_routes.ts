import { Router } from "express";
import { DbType } from "../../../Middleware/SelectDatabase.ts/select_db";
import { verifyAdminToken } from "../../../Middleware/Admin/admin_authentication";
import {
  ProductGetApi,
  productAddApi,
  ProductDispatchToUser,
  ProductDeleteApi,
  undoProductAction,
  addCategoryApi,
  getAllCategory,
  dbType_Select,
  getUsersData,
  UserDeleteApi,
  paymentDetails,
} from "../../Controller/admin_controller";

const adminRouter = Router();

adminRouter.post("/select-db",  dbType_Select);

adminRouter.use(DbType);   

adminRouter.post("/add-category", verifyAdminToken, addCategoryApi);
adminRouter.get("/get-all-category", verifyAdminToken,  getAllCategory);
adminRouter.get("/get-all-user", verifyAdminToken, getUsersData)
adminRouter.post("/add-product", verifyAdminToken, productAddApi);
adminRouter.get("/get-all-product", verifyAdminToken,  ProductGetApi);
adminRouter.delete("/delete-product/:id", verifyAdminToken,  ProductDeleteApi);
adminRouter.delete("/delete-user/:id",verifyAdminToken, UserDeleteApi);
adminRouter.put("/update-enums/:id", verifyAdminToken,  ProductDispatchToUser);
adminRouter.get("/get-payment-details",verifyAdminToken, paymentDetails)
adminRouter.put("/undo-product/:id", verifyAdminToken, undoProductAction);


export default adminRouter;
