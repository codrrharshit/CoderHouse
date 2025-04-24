import {Router} from "express"
import { logout, refresh, sendOtp, verifyOtp } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";


const authRoutes= Router();

authRoutes.post('/sendOtp',sendOtp);
authRoutes.post('/verifyOtp',verifyOtp);
authRoutes.get('/refresh',refresh);
authRoutes.get('/logout',authMiddleware,logout);


export default authRoutes;