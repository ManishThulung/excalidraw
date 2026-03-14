import { Request, Response, NextFunction } from "express";

class ErrorHandler extends Error {
  status: number;
  error: any;
  constructor(status: number, message: string, error?: any) {
    super(message);
    this.status = status;
    this.error = error;
  }
}

export default ErrorHandler;

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any>;

/**
 * A helper function that wraps an async controller in a try-catch block
 * and re-throws any caught errors to the next middleware function.
 * This is useful for handling async errors in express controllers.
 * @param {AsyncController} fn - the async controller to be wrapped
 * @returns {(req: Request, res: Response, next: NextFunction) => Promise<any>} - a middleware function
 */
export const asyncHandler = (fn: AsyncController) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
