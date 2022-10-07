import { Request } from "express";

export interface UserAuthRequest extends Request {
  username?: string;
}
