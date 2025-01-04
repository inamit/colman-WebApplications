import ms from "ms";
import jwt from "jsonwebtoken";
import { Response } from "express";
import { IUser } from '../models/users_model';

export const generateTokens = async (user: IUser) => {
    const accessToken = jwt.sign({ "_id": user._id }, String(process.env.TOKEN_SECRET), { expiresIn: ms(Number(process.env.ACCESS_TOKEN_EXPIRATION_MILLISECONDS)) });
    const random = Math.floor(Math.random() * 1000000).toString();
    const refreshToken = jwt.sign({ "_id": user._id, "random": random }, String(process.env.TOKEN_SECRET), { expiresIn: ms(Number(process.env.REFRESH_TOKEN_EXPIRATION_MILLISECONDS)) });
    return {accessToken, refreshToken};
}

export const updateHeaders = (accessToken: string, refreshToken: string, res: Response) => {
    res.setHeader('Authorization', `Bearer ${accessToken}`);
    res.setHeader('Refresh-Token', refreshToken);
}

export const clearHeaders = (res: Response) => {
    res.removeHeader('Authorization');
    res.removeHeader('Refresh-Token');
}