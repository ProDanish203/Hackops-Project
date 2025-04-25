import { z } from "zod";

const categorySchema = z.object({
  name: z
    .string({ message: "Category name is required*" })
    .min(1, { message: "Category name is required*" }),
  description: z.string(),
  slug: z
    .string({ message: "Category slug is required" })
    .min(1, { message: "Category slug is required*" }),
});

export { categorySchema };
