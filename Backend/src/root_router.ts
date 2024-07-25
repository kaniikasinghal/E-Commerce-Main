import express from 'express';
import authRoutes from './Features/Routes/Auth/auth_routes';
import adminRoutes from './Features/Routes/Admin/admin_routes';
import userRoutes from './Features/Routes/User/user_routes';
import paymentRoutes from "./Features/Routes/Stripe/stripe_routes";

const rootRouter = express.Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/admin",adminRoutes);
rootRouter.use("/user",userRoutes);
rootRouter.use("/payment_intents",paymentRoutes);

export default rootRouter;