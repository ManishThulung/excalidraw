import { z } from "zod";

export const signInSchema = z.object({
  username: z.string({
    message: "Username is required.",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),
});

export const CreateRoomSchema = z.object({
  slug: z.string().min(3).max(20),
});
