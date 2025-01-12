import { z } from "zod";

export const CreateUserSchema = {
  username: z.string().min(3).max(20),
};

export const CreateRoomSchema = z.object({
  name: z.string().min(3).max(20),
});
