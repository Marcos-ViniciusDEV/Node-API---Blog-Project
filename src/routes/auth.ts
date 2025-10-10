import { Router } from "express";
import * as authConstroller from "../controllers/authConstroller";
import { privateRoute } from "../middlewares/prevate-routes";
export const authRoutes = Router();

authRoutes.post("/signup", authConstroller.signup);
authRoutes.post("/signin", authConstroller.signin);
authRoutes.get("/validate", privateRoute, authConstroller.validate);
