import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .email("Invalid email")
    .min(1, { message: "This field is required" })
    .max(150, { message: "Invalid email" }),
  password: z.string().min(1, { message: "Invalid password" }),
  rememberMe: z.boolean(),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
