import {registerUser} from '@/controllers/auth.controller.js';
import {registerSchema} from '@/validation/auth-schema.js';
import {asyncHandler, validateRequest} from '@chatapp/common';
import {Router} from 'express';
export const authRouter: Router = Router();
authRouter.post('/register',validateRequest({body: registerSchema}),asyncHandler(registerUser));

//http://localhost:3000/auth/register