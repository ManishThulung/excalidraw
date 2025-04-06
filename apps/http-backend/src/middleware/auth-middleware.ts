import { JWT_SECRET } from "@repo/backend-common/config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import ErrorHandler from "../errors/error-handler";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.cookies;
    console.log(token);
    // const token = req.headers["authorization"] || "";

    if (!token) {
      throw new ErrorHandler(401, "Unauthorized");
    }
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded as any) {
      // @ts-ignore
      req.userId = (decoded as any).payload.id;
      next();
    } else {
      res.status(403).json({
        message: "You are not logged in",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
