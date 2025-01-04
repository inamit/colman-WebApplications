import ms from "ms";
import jwt from "jsonwebtoken";
import { Response } from "express";
import User, { IUser } from "../models/users_model";

export const generateTokens = async (user: IUser) => {
  const accessToken = jwt.sign(
    { _id: user._id },
    String(process.env.TOKEN_SECRET),
    { expiresIn: ms(Number(process.env.ACCESS_TOKEN_EXPIRATION_MILLISECONDS)) }
  );
  const random = Math.floor(Math.random() * 1000000).toString();
  const refreshToken = jwt.sign(
    { _id: user._id, random: random },
    String(process.env.TOKEN_SECRET),
    { expiresIn: ms(Number(process.env.REFRESH_TOKEN_EXPIRATION_MILLISECONDS)) }
  );
  return { accessToken, refreshToken };
};

export const updateCookies = (
  accessToken: string,
  refreshToken: string,
  res: Response
) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: Number(process.env.ACCESS_TOKEN_EXPIRATION_MILLISECONDS),
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: Number(process.env.REFRESH_TOKEN_EXPIRATION_MILLISECONDS),
  });
};

export const clearCookies = (res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};

const verifyRefreshToken = (refreshToken: string | undefined): Promise<IUser> => {
  return new Promise<IUser>((resolve, reject) => {
    if (!refreshToken) {
      reject("fail");
      return;
    }

    if (!process.env.TOKEN_SECRET) {
      reject("fail");
      return;
    }

    jwt.verify(
      refreshToken,
      process.env.TOKEN_SECRET,
      async (err: any, payload: any) => {
        if (err) {
          reject("fail");
          return;
        }
        const userId = payload._id;

        try {
          const user = await User.findById(userId);
          if (!user) {
            reject("fail");
            return;
          }
          if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
            user.refreshTokens = [];
            await user.save();
            reject("fail");
            return;
          }
          const tokens = user.refreshTokens!.filter(
            (token) => token !== refreshToken
          );
          user.refreshTokens = tokens;

          resolve(user);
        } catch (err) {
          reject("fail");
          return;
        }
      }
    );
  });
};
