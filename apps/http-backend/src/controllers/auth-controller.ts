import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const signup = (req: Request, res: Response) => {
  try {
    console.log("hii");
  } catch (error) {}
};

export const signin = (req: Request, res: Response) => {
  try {
    const token = jwt.sign({ userId: "bar" }, "shhhhh");

    res.status(200).json({ token });
  } catch (error) {}
};
