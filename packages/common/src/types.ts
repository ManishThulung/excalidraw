import { z } from "zod";

export const CreateUserSchema = z.object({
  username: z.string().min(3).max(20),
  name: z.string(),
  password: z.string(),
});

export const SigninUserSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string(),
});

export const CreateRoomSchema = z.object({
  slug: z.string().min(3).max(20),
});
