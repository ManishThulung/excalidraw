import express, { NextFunction, Request, Response } from "express";
import authRouter from "./routes/auth-routes";
import { CreateRoomSchema } from "@repo/common/schema";
import { auth } from "./middleware/auth-middleware";
import ErrorHandler from "./errors/error-handler";
import { prisma } from "@repo/db/prisma";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Prisma } from "@prisma/client";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: ["http://localhost:3000", "http://127.0.0.1:3001"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/api", authRouter);

// create room
app.post(
  "/api/room",
  auth,
  async (req: any, res: Response, next: NextFunction) => {
    const { data, success } = CreateRoomSchema.safeParse(req.body);
    if (!success) {
      throw new ErrorHandler(400, "Bad Request");
    }
    try {
      const room = await prisma.room.create({
        data: {
          slug: data.slug,
          adminId: Number(req.userId),
        },
      });
      if (!room) {
        throw new ErrorHandler(500, "Internal server error");
      }
      res.status(201).json({
        success: true,
        room,
        message: "created successfull",
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          return next(new ErrorHandler(400, "Room already exists."));
        }
      }
      next(err);
    }
  }
);

app.get(
  "/api/room",
  auth,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const rooms = await prisma.room.findMany({
        where: {
          adminId: Number(req.userId),
        },
        include: {
          admin: { select: { id: true, username: true } },
        },
      });
      if (!rooms) {
        throw new ErrorHandler(404, "Rooms not found!");
      }
      res.status(200).json({
        success: true,
        rooms,
      });
    } catch (err) {
      next(err);
    }
  }
);

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
          roomId,
        },
        orderBy: {
          id: "desc",
        },
        select: {
          id: true,
          type: true,
          content: true,
          roomId: true,
          userId: true,
        },
      });
      if (!shapes) {
        throw new ErrorHandler(500, "Internal server error");
      }
      res.status(200).json({
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

app.listen(4000, () => {
  console.log("RUNNING HTTP SERVER ON PORT 4000");
});
