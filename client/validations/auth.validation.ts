import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string({ message: "Email is required*" })
    .min(1, { message: "Email is required*" })
    .email({ message: "Invalid email address" }),
  password: z
    .string({ message: "Password is required" })
    .min(1, { message: "Password is required*" })
    .min(6, { message: "Password must be atleast 6 characters" }),
});

export { loginSchema };
