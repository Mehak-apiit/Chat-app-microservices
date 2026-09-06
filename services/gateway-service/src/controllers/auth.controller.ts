import { authProxyService } from "@/services/auth-proxy.service.js";
import {registerSchema} from '@/validation/auth-schema.js';
import type {AsyncHandler} from '@chatapp/common';
export const registerUser: AsyncHandler = async (req,res,next) => {
    try {
        const payload = registerSchema.parse(req.body);
        const response = await authProxyService.register(payload);
        res.status(201).json(response);
    } catch (error) {
        next(error);
        
    }
};