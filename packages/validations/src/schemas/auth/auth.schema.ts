import { z } from "zod"

export const registerSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[0-9]/, { message: "Must contain at least 1 number" })
      .regex(/[a-z]/, { message: "Must contain at least 1 lowercase letter" })
      .regex(/[A-Z]/, { message: "Must contain at least 1 uppercase letter" }),
    confirmPassword: z.string(),
  })
  .refine((data: any) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(/[a-zA-Z0-9]/, { message: "Password must be alphanumeric" }),
  remember: z.boolean().optional().default(false),
})

export const forgetPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
})

export const changePasswordByForgetSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .regex(/[a-zA-Z0-9]/, { message: "Password must be alphanumeric" }),
    confirmPassword: z.string(),
  })
  .refine((data: any) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })

export type RegisterSchema = z.infer<typeof registerSchema>
export type LoginSchema = z.infer<typeof loginSchema>
export type ForgetPasswordSchema = z.infer<typeof forgetPasswordSchema>
export type ChangePasswordByForgetSchema = z.infer<
  typeof changePasswordByForgetSchema
>
