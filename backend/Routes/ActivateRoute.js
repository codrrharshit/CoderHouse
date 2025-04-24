import {Router} from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { activate } from "../controllers/activate.controller.js";

const activateRoutes= Router();

activateRoutes.post("/activate",authMiddleware,activate)



export default  activateRoutes