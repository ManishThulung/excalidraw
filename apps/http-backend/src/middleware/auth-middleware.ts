import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try{
    const token = req.headers["authorization"] || ""
    const decoded = jwt.verify(token, "shhhhh")

    if(decoded){
      // @ts-ignore
      req.userId = decoded.userId
      next()
    }
  } catch(error){
    console.log(error)
  }
}