import {Router} from "express";
import {validateRequest} from "@chatapp/common";
import { registerHandler } from "@/controllers/auth.controller";
export const authRouter: Router = Router();
authRouter.post("/register",validateRequest({}),registerHandler);