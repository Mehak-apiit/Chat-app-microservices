import {HttpError} from '../errors/http-error';
import type {RequestHandler} from 'express';
export interface InternalAuthOptions {
    headerName?: string;
    exemptPaths?: string[];
}
const DEFAULT_HEADER_NAME = 'x-internal-auth';
const createInernalAuthMiddleware = (
    expectedToken: string,
    options: InternalAuthOptions = {},

): RequestHandler => {
    const headerName = options.headerName?.toLocaleLowerCase() ?? DEFAULT_HEADER_NAME;
    const exemptPaths = new Set(options.exemptPaths ?? []);
    return (req,res,next) => {
        if(exemptPaths.has(req.path)){
            next();
            return;
        }
        const provided  = req.headers[headerName];
        const token = Array.isArray(provided) ? provided[0] : provided;
        if (typeof token !== 'string' || token !== expectedToken){
            next(new HttpError(401, 'Unauthorized'));
            return;
        }
        next();
    };
    
};
export {createInernalAuthMiddleware};