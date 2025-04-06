import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { signInSchema } from "@repo/common/schema";
import ErrorHandler from "../errors/error-handler";
import { prisma } from "@repo/db/prisma";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { data, success } = signInSchema.safeParse(req.body);
  if (!success) {
    throw new ErrorHandler(400, "Bad Request");
  }

  try {
    const hashedPassword = await hashData(data.password);
    const user = await prisma.user.create({
      data: {
        username: data.username,
        password: hashedPassword,
      },
    });
    if (!user) {
      throw new ErrorHandler(500, "Internal server error");
    }
    res.status(201).json({ success: true, message: "Sign up successfull" });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        throw new ErrorHandler(400, "Username already exists.");
      }
    }
    next(err);
  }
};

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { data, success } = signInSchema.safeParse(req.body);
  if (!success) {
    throw new ErrorHandler(400, "Bad Request");
  }

  try {
    const existUser = await prisma.user.findFirst({
      where: {
        username: data?.username,
      },
    });

    if (!existUser) {
      throw new ErrorHandler(400, "Invalid credentials");
    }

    const isPasswordCorrect = compare(data.password, existUser?.password);

    if (!isPasswordCorrect) {
      throw new ErrorHandler(400, "Invalid credentials");
    }

    const token = jwt.sign({ payload: existUser }, JWT_SECRET);
    console.log(token, "send token");
    res.cookie("token", token, {
      httpOnly: true,
    });
    res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export async function hashData(password: string): Promise<string> {
  const hashedData = await bcrypt.hash(password, 10);
  return hashedData;
}

export async function compare(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}
