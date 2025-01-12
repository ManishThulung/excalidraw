import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { CreateUserSchema, SigninUserSchema } from "@repo/common/schema";
import ErrorHandler from "../errors/error-handler";
import { prisma } from "@repo/db/prisma";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { data, success } = CreateUserSchema.safeParse(req.body);
  if (!success) {
    throw new ErrorHandler(400, "Bad Request");
  }

  try {
    const user = await prisma.user.create({
      data: {
        ...data,
      },
    });
    if (!user) {
      throw new ErrorHandler(500, "Internal server error");
    }
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { data, success } = SigninUserSchema.safeParse(req.body);
  if (!success) {
    throw new ErrorHandler(400, "Bad Request");
  }

  try {
    const existUser = await prisma.user.findFirst({
      where: {
        username: data?.username,
      },
      omit: {
        password: true,
      },
    });

    if (!existUser) {
      throw new ErrorHandler(404, "User not found");
    }

    const token = jwt.sign({ payload: existUser }, JWT_SECRET);

    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};
