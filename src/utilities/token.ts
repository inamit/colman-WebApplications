import ms from "ms";
import jwt from "jsonwebtoken";
import { Response } from "express";
import User, { IUser } from "../models/users_model";

const generateTokens = async (user: IUser) => {
    const accessToken = jwt.sign({ "_id": user._id }, String(process.env.TOKEN_SECRET), { expiresIn: ms(Number(process.env.ACCESS_TOKEN_EXPIRATION_MILLISECONDS)) });
    const random = Math.floor(Math.random() * 1000000).toString();
    const refreshToken = jwt.sign({ "_id": user._id, "random": random }, String(process.env.TOKEN_SECRET), { expiresIn: ms(Number(process.env.REFRESH_TOKEN_EXPIRATION_MILLISECONDS)) });
    return { accessToken, refreshToken };
}

const setTokens = (accessToken: string, refreshToken: string, res: Response) => {
    res.status(200).json({
        accessToken: `Bearer ${accessToken}`,
        refreshToken: `Bearer ${refreshToken}`,
        message: "logged in successfully."
    });
}

const clearTokens = (res: Response) => {
    res.status(200).json({message: "logged out successfully."});
}

export default {
    generateTokens,
    setTokens,
    clearTokens,
  };