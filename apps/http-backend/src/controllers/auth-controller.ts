import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export const signup = (req: Request, res: Response) => {
  try {
    res.status(200).json({ token: "jlk" });
  } catch (error) {}
};

export const signin = (req: Request, res: Response) => {
  try {
    const token = jwt.sign({ userId: "bar" }, JWT_SECRET);

    res.status(200).json({ token });
  } catch (error) {}
};
