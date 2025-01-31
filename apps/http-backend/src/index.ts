import express, { NextFunction, Request, Response } from "express";
import authRouter from "./routes/auth-routes";
import { CreateRoomSchema } from "@repo/common/schema";
import { auth } from "./middleware/auth-middleware";
import ErrorHandler from "./errors/error-handler";
import { prisma } from "@repo/db/prisma";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRouter);

app.post("/api/room", auth, (req: any, res: Response, next: NextFunction) => {
  const { data, success } = CreateRoomSchema.safeParse(req.body);
  if (!success) {
    throw new ErrorHandler(400, "Bad Request");
  }
  try {
    const room = prisma.room.create({
      data: {
        slug: data.slug,
        adminId: Number(req.userId),
      },
    });
    if (!room) {
      throw new ErrorHandler(500, "Internal server error");
    }
    res.status(201).json({
      room,
      message: "created successfull",
    });
  } catch (error) {
    next(error);
  }
});

app.get(
  "/api/chats/:roomId",
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    const roomId = Number(req.params.roomId);
    try {
      const chats = await prisma.chat.findMany({
        where: {
          id: roomId,
        },
        orderBy: {
          id: "desc",
        },
        take: 50,
      });
      if (!chats) {
        throw new ErrorHandler(500, "Internal server error");
      }
      res.status(201).json({
        chats,
      });
    } catch (error) {
      next(error);
    }
  }
);

app.get(
  "/api/shapes/:roomId",
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    const roomId = Number(req.params.roomId);
    try {
      const shapes = await prisma.shape.findMany({
        where: {
          id: roomId,
        },
        orderBy: {
          id: "desc",
        },
      });
      if (!shapes) {
        throw new ErrorHandler(500, "Internal server error");
      }
      res.status(201).json({
        shapes,
      });
    } catch (error) {
      next(error);
    }
  }
);

app.get(
  "/api/room/:slug",
  async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;
    try {
      const chats = await prisma.room.findFirst({
        where: {
          slug,
        },
      });
      if (!chats) {
        throw new ErrorHandler(500, "Internal server error");
      }
      res.status(201).json({
        chats,
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

app.listen(6000, () => {
  console.log("RUNNING HTTP SERVER ON PORT 6000");
});
