import type {Router} from 'express';
import {authRouter} from '@/routes/auth.routes.js';
export const registerRoutes = (app: Router) => {
    app.use('/auth',authRouter);
};
//http://localhost:3000/auth