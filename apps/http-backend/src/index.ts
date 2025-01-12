import express, { NextFunction, Request, Response } from "express";
import authRouter from "./routes/auth-routes";
import { JWT_SECRET } from "@repo/backend-common/config";
import { CreateRoomSchema } from "@repo/common/schema";
import { auth } from "./middleware/auth-middleware";
import ErrorHandler from "./errors/error-handler";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRouter);

app.post(
  "/api/room",
  auth,
  (req: Request, res: Response, next: NextFunction) => {
    const { data, success } = CreateRoomSchema.safeParse(req.body);
    console.log(data, "data");
    if (!success) {
      throw new ErrorHandler(400, "Bad Request");
    }
    try {
      res.status(201).json({
        message: "created successfull",
      });
    } catch (error) {
      next(error);
    }
  }
);

app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new ErrorHandler(404, "route not found");
  res.status(error.status).json({
    message: error.message,
  });
});

app.use(
  (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || "Internal server error";
    res.status(status).json({
      message,
    });
  }
);

app.listen(6050, () => {
  console.log(JWT_SECRET, "JWT_SECRET");
  console.log("RUNNING HTTP SERVER ON PORT 6050");
});
