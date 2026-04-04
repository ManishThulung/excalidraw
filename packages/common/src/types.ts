import { z } from "zod";

export const signUpSchema = z.object({
  username: z.string({
    message: "Username is required.",
  }),
  email: z.string({
    message: "Email is required.",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    ),
});

export const signInSchema = signUpSchema.omit({ username: true });

export const createRoomSchema = z.object({
  name: z.string().min(3).max(20),
});

// export const CreateRoomInput = z.infer<typeof createRoomSchema>;

export const chatContentSchema = z.object({
  content: z.string().max(5000, "Message cannot exceed 5000 characters"),
});
