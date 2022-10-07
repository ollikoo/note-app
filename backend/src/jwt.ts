import jwt from "jsonwebtoken";
import { NextFunction, Response } from "express";
import { UserAuthRequest } from "./types/UserAuthRequest.js";
import * as dotenv from "dotenv";
dotenv.config();

export const generateToken = (username: string) => {
  const payload = { username: username };
  const result = jwt.sign(payload, process.env.TOKEN_SECRET as string, {
    expiresIn: process.env.TOKEN_EXPIRATION_TIME,
  });
  return result;
};

export const validateToken = (
  req: UserAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.sendStatus(403);
  }

  try {
    const result: any = jwt.verify(token, process.env.TOKEN_SECRET as string);
    req.username = result.username;
    next();
  } catch {
    return res.sendStatus(403);
  }
};
