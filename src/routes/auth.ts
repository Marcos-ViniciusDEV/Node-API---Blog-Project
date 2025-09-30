import { Router } from "express";
import * as authConstroller from "../controllers/authConstroller";
export const authRoutes = Router();

authRoutes.post("signup", authConstroller.signup);
authRoutes.post("signin", authConstroller.signin);
authRoutes.post("valide", authConstroller.validate);
