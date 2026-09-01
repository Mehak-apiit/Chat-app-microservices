import {env} from '@/config/env';
import bcrypt from 'bcryptjs';
import jwt, {type Secret, type SignOptions} from 'jsonwebtoken';
const ACCESS_TOKEN: Secret = env.JWT_SECRET;
const REFRESH_TOKEN: Secret = env.JWT_REFRESH_SECRET;
export const generateAccessToken = async (payload: object): Promise<string> =>{
    const saltRounds = 12;

    return bcrypt.hash(JSON.stringify(payload),saltRounds);
}
export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 12;
    return bcrypt.hash(password,saltRounds);
}
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password,hash);
}
export interface AccessTokenPayload {
    sub: string; //userId
    email: string;
}
export interface RefreshTokenPayload{
    sub:string; //userId
    tokenId: string;
}
export const signAccessToken = (payload: AccessTokenPayload): string => {
    return jwt.sign(payload,ACCESS_TOKEN,{expiresIn:"1d"});
};
export const signRefreshToken = (payload: RefreshTokenPayload): string =>{
    return jwt.sign(payload,REFRESH_TOKEN,{expiresIn:"1d"});
};
export const verifyRefreshToken = (payload: string): RefreshTokenPayload =>{
    return jwt.verify(payload,REFRESH_TOKEN) as RefreshTokenPayload;
};