import { JWT_SECRET } from "@repo/backend-common/config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import ErrorHandler from "../errors/error-handler";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers["authorization"] || "";
    if (!token) {
      throw new ErrorHandler(401, "Unauthorized");
    }
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded) {
      // @ts-ignore
      req.userId = decoded.userId;
      next();
    }
  } catch (error) {
    next(error);
  }
};
