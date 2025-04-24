import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createRoom, getRoom, getRoomById } from "../controllers/room.controller.js";

const RoomRoutes= Router();

RoomRoutes.post('/create',authMiddleware,createRoom);
RoomRoutes.get('/getroom',authMiddleware,getRoom);
RoomRoutes.get('/getroom/:roomId',authMiddleware,getRoomById)

export default RoomRoutes;